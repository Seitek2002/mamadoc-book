'use client';

import { useState, useEffect, Fragment } from 'react';
import clsx from 'clsx';
import { DoctorsDetailsCard } from '@/widgets';
import {
  DoctorsSchedule,
  ServicesSelection,
  PhoneModal,
  OTPModal,
  SuccessModal,
  PaymentModal,
} from '@/features';
import type { ApiDoctorDetail, ApiCalendarDay, ApiTimeSlot, ApiPhoneCountry, ApiReview } from '@/shared/mock';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  createBooking,
  createPaylink,
  setToken,
  getToken,
  removeToken,
  getProfessionalAvailableTimes,
  getProfessionalAvailableServices,
  getBranchById,
  type BookingResult,
  type ApiError,
} from '@/shared/api';
import type { ApiService } from '@/shared/mock';

interface BookingWrapperProps {
  id: string;
  doctor: ApiDoctorDetail;
  calendar: ApiCalendarDay[];
  countries?: ApiPhoneCountry[];
  reviews: ApiReview[];
  reviewsTotal: number;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 whitespace-nowrap'>
    {text}
    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45' />
  </div>
);

const STEPS = ['Дата', 'Время', 'Услуги'];

const serviceWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'услуга';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'услуги';
  return 'услуг';
};

const StepIndicator = ({ current }: { current: number }) => (
  <div className='flex items-center'>
    {STEPS.map((label, idx) => {
      const num = idx + 1;
      const done = num < current;
      const active = num === current;
      return (
        <Fragment key={label}>
          <div className='flex items-center gap-1.5 shrink-0'>
            <div
              className={clsx(
                'size-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shrink-0',
                active
                  ? 'bg-[#007BFF] text-white ring-3 ring-[#007BFF]/15'
                  : done
                  ? 'bg-[#5CB85C] text-white'
                  : 'bg-white border-2 border-[#DDE1E8] text-[#98A2B3]',
              )}
            >
              {done ? (
                <svg width='9' height='7' viewBox='0 0 10 8' fill='none'>
                  <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              ) : (
                num
              )}
            </div>
            <span
              className={clsx(
                'text-[12px] font-semibold whitespace-nowrap',
                active ? 'text-[#007BFF]' : done ? 'text-[#5CB85C]' : 'text-[#98A2B3]',
              )}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={clsx(
                'flex-1 h-0.5 rounded-full mx-2.5 transition-colors',
                done ? 'bg-[#5CB85C]' : 'bg-[#E7EAEF]',
              )}
            />
          )}
        </Fragment>
      );
    })}
  </div>
);

// Календарь с бэка всегда фиксирован на 30 дней вперёд и не поддерживает
// пагинацию (даже нестандартные query-параметры игнорируются). Чтобы можно
// было листать дальше, дозагружаем дни сами через available-times — этот
// эндпоинт, в отличие от календаря, отдаёт данные на любую дату в будущем.
const CALENDAR_LOAD_BATCH = 14;
const CALENDAR_MAX_DAYS = 90;

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export function BookingWrapper({ id, doctor, calendar, countries, reviews, reviewsTotal }: BookingWrapperProps) {
  const [calendarDays, setCalendarDays] = useState(calendar);
  const [isLoadingMoreDays, setIsLoadingMoreDays] = useState(false);
  const hasMoreDays = calendarDays.length < CALENDAR_MAX_DAYS;

  const firstAvailable = calendarDays.find((d) => d.is_available);

  const [selectedDate, setSelectedDate] = useState(firstAvailable?.date ?? '');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [filteredTimes, setFilteredTimes] = useState<ApiTimeSlot[] | null>(null);
  const [filteredServices, setFilteredServices] = useState<ApiService[] | null>(null);
  const [isTimesLoading, setIsTimesLoading] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{ url: string; amount: number; total?: number } | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [errors, setErrors] = useState({ date: false, time: false, services: false });
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  // Разовый флаг: как только время выбрано хотя бы раз, услуги остаются
  // видимыми и дальше, даже если время потом сбросится (смена даты/услуг)
  const [isServicesUnlocked, setIsServicesUnlocked] = useState(false);

  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // После ухода на оплату страница остаётся в истории браузера. При возврате
  // «Назад» из банка браузер восстанавливает её из bfcache со старым состоянием
  // (включая прошлые выбранные услуги) и устаревшими слотами — перезагружаем.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // Пока услуги не выбраны, сетку времени запрашиваем по самой короткой
  // услуге врача: сервер отдаёт полную сетку дня с флагом busy, и занятые
  // слоты видны серыми ещё до выбора услуг
  const fallbackServiceIds = doctor.services.length
    ? [doctor.services.reduce((a, b) =>
        (b.duration_min ?? Infinity) < (a.duration_min ?? Infinity) ? b : a,
      ).id]
    : [];

  const fetchTimes = async (date: string, serviceIds: number[]): Promise<ApiTimeSlot[] | null> => {
    const ids = serviceIds.length > 0 ? serviceIds : fallbackServiceIds;
    if (ids.length === 0) {
      setFilteredTimes(null);
      return null;
    }
    setIsTimesLoading(true);
    try {
      const res = await getProfessionalAvailableTimes(id, { date, service_ids: ids });
      setFilteredTimes(res.times);
      return res.times;
    } catch {
      setFilteredTimes(null);
      return null;
    } finally {
      setIsTimesLoading(false);
    }
  };

  const loadMoreDays = async () => {
    if (isLoadingMoreDays || !hasMoreDays || fallbackServiceIds.length === 0 || calendarDays.length === 0) {
      return;
    }
    setIsLoadingMoreDays(true);
    try {
      const lastDate = new Date(calendarDays[calendarDays.length - 1].date);
      const batchSize = Math.min(CALENDAR_LOAD_BATCH, CALENDAR_MAX_DAYS - calendarDays.length);
      const dates = Array.from({ length: batchSize }, (_, i) => {
        const d = new Date(lastDate);
        d.setDate(d.getDate() + i + 1);
        return toIsoDate(d);
      });

      const results = await Promise.all(
        dates.map((date) =>
          getProfessionalAvailableTimes(id, { date, service_ids: fallbackServiceIds }).catch(() => null),
        ),
      );

      const newDays: ApiCalendarDay[] = dates.map((date, i) => {
        const res = results[i];
        const freeTimes = res ? res.times.filter((t) => !t.busy).map((t) => t.time) : [];
        const label = new Date(date)
          .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
          .replace('.', '');
        return {
          date,
          label,
          is_available: freeTimes.length > 0,
          slots_count: freeTimes.length,
          times: freeTimes,
        };
      });

      setCalendarDays((prev) => [...prev, ...newDays]);
    } finally {
      setIsLoadingMoreDays(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setFilteredServices(null);
    setErrors((prev) => ({ ...prev, date: false }));
    setCurrentStep(2);

    await fetchTimes(date, selectedServices);
  };

  const handleTimeChange = async (time: string) => {
    setSelectedTime(time);
    setErrors((prev) => ({ ...prev, time: false }));
    if (time) {
      setCurrentStep(3);
      setIsServicesUnlocked(true);
    }

    if (!time || !selectedDate) return;
    setIsServicesLoading(true);
    try {
      const res = await getProfessionalAvailableServices(id, { date: selectedDate, time });
      setFilteredServices(res.data);
      // Убираем из выбора услуги, недоступные на новое время, — иначе их id
      // незаметно уйдут в service_ids при создании брони
      setSelectedServices((prev) => prev.filter((sid) => res.data.some((s) => s.id === sid)));
    } catch {
      setFilteredServices(null);
    } finally {
      setIsServicesLoading(false);
    }
  };

  const handleServicesChange = async (serviceIds: number[]) => {
    setSelectedServices(serviceIds);
    setErrors((prev) => ({ ...prev, services: false }));

    if (!selectedDate) return;
    const times = await fetchTimes(selectedDate, serviceIds);
    if (times && selectedTime && !times.some((t) => t.time === selectedTime && !t.busy)) {
      setSelectedTime('');
      setCurrentStep(2);
    }
  };

  // Ошибки авторизации: токен истёк или невалиден — нужно заново пройти OTP
  const isAuthError = (e: ApiError) =>
    e.error === 'not_authenticated' || e.error === 'authentication_failed' || e.error === 'token_not_valid';

  // Обработка платёжных ошибок создания брони. Возвращает true, если ошибка обработана.
  const handlePaymentErrors = async (e: ApiError, access_token: string): Promise<boolean> => {
    if (e.error === 'payment_required') {
      const branchId = Number(e.details?.branch_id);
      const paylink = await createPaylink(branchId, access_token);
      setPaymentInfo({ url: paylink.paylink_url, amount: paylink.amount });
      setPaymentError('');
      setIsOtpModalOpen(false);
      setIsPaymentModalOpen(true);
      return true;
    }
    if (e.error === 'payment_not_paid') {
      setPaymentError('Платёж ещё не подтверждён. Подождите немного и попробуйте снова.');
      setIsOtpModalOpen(false);
      setIsPaymentModalOpen(true);
      return true;
    }
    return false;
  };

  const handleBooking = async () => {
    const isDateInvalid = !selectedDate;
    const isTimeInvalid = !selectedTime;
    const isServicesInvalid = selectedServices.length === 0;

    setErrors({ date: isDateInvalid, time: isTimeInvalid, services: isServicesInvalid });

    if (isDateInvalid) { setCurrentStep(1); return; }
    if (isTimeInvalid) { setCurrentStep(2); return; }
    if (isServicesInvalid) { setCurrentStep(3); return; }

    setBookingError('');

    // Если токен сохранён с прошлой авторизации — бронируем сразу, без телефона и OTP
    const token = getToken();
    if (!token) {
      setIsPhoneModalOpen(true);
      return;
    }

    setIsBookingLoading(true);
    try {
      await submitBooking(token);
    } catch (err) {
      const e = err as ApiError;
      if (isAuthError(e)) {
        // Токен истёк — чистим его и запрашиваем OTP заново
        removeToken();
        setIsPhoneModalOpen(true);
        return;
      }
      try {
        if (await handlePaymentErrors(e, token)) return;
      } catch {
        // не удалось создать платёжную ссылку — покажем исходную ошибку
      }
      setBookingError(e.message ?? 'Ошибка записи');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handlePhoneSubmit = async (phoneNumber: string, fullName: string) => {
    setPhoneError('');
    setIsPhoneLoading(true);
    try {
      await sendOtp({ phone: phoneNumber, full_name: fullName });
      setCurrentPhone(phoneNumber);
      setCurrentName(fullName);
      setIsPhoneModalOpen(false);
      setIsOtpModalOpen(true);
    } catch (err) {
      const e = err as ApiError;
      setPhoneError(e.message ?? 'Ошибка отправки кода');
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpError('');
    try {
      await sendOtp({ phone: currentPhone, full_name: currentName });
    } catch (err) {
      const e = err as ApiError;
      setOtpError(e.message ?? 'Ошибка повторной отправки');
    }
  };

  const submitBooking = async (access_token: string) => {
    const result = await createBooking(
      {
        professional_id: doctor.id,
        date: selectedDate,
        time: selectedTime,
        service_ids: selectedServices,
      },
      access_token,
    );

    // Бронь требует предоплаты — сервер вернул ссылку на оплату.
    // После оплаты банк вернёт пользователя на /bookings.
    if (result.data.paylink_url) {
      // Мастер выбирает модель оплаты: фиксированный депозит или полная
      // стоимость. Сумма пейлинка задаётся настройкой филиала — если она
      // меньше стоимости брони, это депозит, и пользователя надо предупредить.
      if (result.data.branch_id != null) {
        try {
          const branch = await getBranchById(result.data.branch_id);
          const deposit = branch.data.paylink_amount;
          if (deposit != null && deposit > 0 && deposit < result.data.total_price) {
            setPaymentInfo({
              url: result.data.paylink_url,
              amount: deposit,
              total: result.data.total_price,
            });
            setPaymentError('');
            setIsOtpModalOpen(false);
            setIsPaymentModalOpen(true);
            return;
          }
        } catch {
          // не удалось определить модель — просто уходим на оплату
        }
      }
      window.location.href = result.data.paylink_url;
      return;
    }

    setBookingResult(result.data);
    setIsOtpModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleOtpSubmit = async (otpCode: string) => {
    setOtpError('');
    setIsOtpLoading(true);
    try {
      const verifyResult = await verifyOtp({ phone: currentPhone, code: otpCode });
      let access_token: string;
      if (!verifyResult.needs_profile) {
        access_token = verifyResult.access_token!;
      } else {
        const profileRes = await completeProfile(
          { phone: currentPhone, full_name: currentName },
          verifyResult.code!,
        );
        access_token = profileRes.access_token;
      }
      setToken(access_token);
      localStorage.setItem('saved_phone', currentPhone);
      localStorage.setItem('saved_name', currentName);

      try {
        await submitBooking(access_token);
      } catch (err) {
        const e = err as ApiError;
        if (await handlePaymentErrors(e, access_token)) return;
        throw err;
      }
    } catch (err) {
      const e = err as ApiError;
      setOtpError(e.message ?? 'Ошибка записи');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    const token = getToken();
    if (!token) {
      setIsPaymentModalOpen(false);
      setIsPhoneModalOpen(true);
      return;
    }
    setPaymentError('');
    setIsPaymentLoading(true);
    try {
      await submitBooking(token);
    } catch (err) {
      const e = err as ApiError;
      if (e.error === 'payment_not_paid') {
        setPaymentError('Платёж ещё не подтверждён. Подождите немного и попробуйте снова.');
      } else if (e.error === 'payment_required' && paymentInfo === null) {
        try {
          const paylink = await createPaylink(Number(e.details?.branch_id), token);
          setPaymentInfo({ url: paylink.paylink_url, amount: paylink.amount });
        } catch {
          setPaymentError(e.message ?? 'Требуется оплата брони');
        }
      } else {
        setPaymentError(e.message ?? 'Ошибка записи');
      }
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const chosenServices = (filteredServices ?? doctor.services).filter((s) =>
    selectedServices.includes(s.id),
  );
  const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);
  const formattedDay = selectedDate
    ? new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    : '';

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-36 lg:pb-0'>

        {/* Left column: doctor card (отзывы теперь открываются модалкой из карточки) */}
        <div className='lg:col-start-1 lg:row-start-1 mx-4 flex flex-col gap-4'>
          <DoctorsDetailsCard doctor={doctor} reviews={reviews} reviewsTotal={reviewsTotal} />
        </div>

        {/* Right column: step indicator at top + step content (both mobile & desktop) */}
        <div className='lg:col-start-2 lg:row-start-1 mx-4 lg:mx-0 flex flex-col gap-3'>

          {/* Step indicator */}
          <div className='bg-white rounded-xl px-3.5 py-2.5 shadow-sm'>
            <StepIndicator current={currentStep} />
          </div>

          {/*
            Дата всегда видна первой. Время появляется, как только выбрана
            дата, и остаётся на экране — выбор даты никуда не пропадает.
            Услуги появляются, как только выбрано время, и рендерятся НАД
            блоком даты/времени; дальше тоже не прячутся, даже если время
            потом сбросится (смена даты/услуг).
          */}
          {isServicesUnlocked && (
            <div
              className={clsx(
                'rounded-2xl transition-all duration-300 relative border-2 animate-in fade-in slide-in-from-top-2',
                errors.services ? 'border-red-400' : 'border-transparent',
              )}
            >
              {errors.services && <Tooltip text='Пожалуйста, выберите хотя бы одну услугу' />}
              <ServicesSelection
                services={filteredServices ?? doctor.services}
                selectedServices={selectedServices}
                onChange={handleServicesChange}
                isLoading={isServicesLoading}
              />
            </div>
          )}

          <div className='relative'>
            {(errors.date || errors.time) && (
              <Tooltip text={errors.date ? 'Пожалуйста, выберите дату' : 'Пожалуйста, выберите время'} />
            )}
            <DoctorsSchedule
              calendar={calendarDays}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedTime={selectedTime}
              onTimeChange={handleTimeChange}
              isDateError={errors.date}
              isTimeError={errors.time}
              overrideTimes={filteredTimes}
              isTimesLoading={isTimesLoading}
              onLoadMoreDays={loadMoreDays}
              isLoadingMoreDays={isLoadingMoreDays}
              hasMoreDays={hasMoreDays}
            />
          </div>

          {/* Desktop summary + book button */}
          <div className='hidden lg:flex flex-col items-center gap-3 pt-2 pb-4'>
            {(selectedDate || selectedTime || chosenServices.length > 0) && (
              <div className='flex items-center flex-wrap justify-center gap-2 text-[13px] font-medium text-dark'>
                {selectedDate && (
                  <span className='inline-flex items-center gap-1.5 bg-white border border-[#E7E7EE] rounded-full px-3.5 py-1.5 shadow-sm'>
                    <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='#98A2B3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
                      <line x1='16' y1='2' x2='16' y2='6' />
                      <line x1='8' y1='2' x2='8' y2='6' />
                      <line x1='3' y1='10' x2='21' y2='10' />
                    </svg>
                    {formattedDay}
                  </span>
                )}
                {selectedTime && (
                  <span className='inline-flex items-center gap-1.5 bg-white border border-[#E7E7EE] rounded-full px-3.5 py-1.5 shadow-sm tabular-nums'>
                    <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='#98A2B3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <circle cx='12' cy='12' r='10' />
                      <polyline points='12 6 12 12 16 14' />
                    </svg>
                    {selectedTime}
                  </span>
                )}
                {chosenServices.length > 0 && (
                  <span className='inline-flex items-center gap-1.5 bg-white border border-[#E7E7EE] rounded-full px-3.5 py-1.5 shadow-sm'>
                    {chosenServices.length === 1
                      ? chosenServices[0].name
                      : `${chosenServices.length} ${serviceWord(chosenServices.length)}`}
                  </span>
                )}
                {totalPrice > 0 && (
                  <span className='inline-flex items-center gap-1.5 bg-[#EAF3FF] text-[#007BFF] font-semibold rounded-full px-3.5 py-1.5 tabular-nums'>
                    {totalPrice.toLocaleString('ru-RU')} с
                  </span>
                )}
              </div>
            )}
            {bookingError && (
              <p className='text-sm text-red-500 text-center'>{bookingError}</p>
            )}
            <button
              onClick={handleBooking}
              disabled={isBookingLoading}
              className='bg-[#007BFF] hover:bg-[#0069D9] disabled:opacity-60 font-semibold text-white w-77 h-11 text-base rounded-full shadow-[0_8px_20px_rgba(0,123,255,0.3)] active:scale-95 transition-all'
            >
              {isBookingLoading ? 'Записываем...' : 'Записаться'}
            </button>
          </div>
        </div>

      </div>

      {/* Fixed mobile bottom bar: summary + CTA */}
      <div className='fixed lg:hidden bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEDF1] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex flex-col gap-2.5'>
        {bookingError && (
          <p className='text-xs text-red-500 text-center'>{bookingError}</p>
        )}
        <div className='flex items-center justify-between gap-3 text-[13px] font-medium text-dark'>
          <span className='truncate'>
            {selectedDate && selectedTime
              ? `${formattedDay} · ${selectedTime}`
              : selectedDate
              ? formattedDay
              : 'Выберите дату и время'}
            {chosenServices.length > 0 && (
              <span className='text-[#98A2B3]'>
                {' '}· {chosenServices.length} {serviceWord(chosenServices.length)}
              </span>
            )}
          </span>
          {totalPrice > 0 && (
            <span className='shrink-0 font-bold text-[#007BFF] tabular-nums'>
              {totalPrice.toLocaleString('ru-RU')} с
            </span>
          )}
        </div>
        <button
          onClick={handleBooking}
          disabled={isBookingLoading}
          className='w-full h-11 text-[15px] bg-[#007BFF] hover:bg-[#0069D9] disabled:opacity-60 font-semibold text-white rounded-full shadow-[0_6px_16px_rgba(0,123,255,0.25)] active:scale-[0.98] transition-all'
        >
          {isBookingLoading ? 'Записываем...' : 'Записаться'}
        </button>
      </div>

      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => { setIsPhoneModalOpen(false); setPhoneError(''); }}
        onContinue={handlePhoneSubmit}
        error={phoneError}
        isLoading={isPhoneLoading}
        countries={countries}
      />

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => { setIsOtpModalOpen(false); setOtpError(''); }}
        onSubmit={handleOtpSubmit}
        onResend={handleResend}
        phoneNumber={currentPhone}
        error={otpError}
        isLoading={isOtpLoading}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => { setIsPaymentModalOpen(false); setPaymentError(''); }}
        onPaid={handlePaymentConfirm}
        paylinkUrl={paymentInfo?.url ?? ''}
        amount={paymentInfo?.amount ?? 0}
        totalPrice={paymentInfo?.total}
        error={paymentError}
        isLoading={isPaymentLoading}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        booking={bookingResult}
      />
    </>
  );
}
