'use client';

import { useState, Fragment } from 'react';
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
import type { ApiDoctorDetail, ApiCalendarDay, ApiPhoneCountry, ApiReview } from '@/shared/mock';
import { ReviewsBlock } from './ReviewsBlock';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  createBooking,
  createPaylink,
  setToken,
  getToken,
  getProfessionalAvailableTimes,
  getProfessionalAvailableServices,
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

const StepIndicator = ({ current }: { current: number }) => (
  <div className='flex items-center px-1'>
    {STEPS.map((label, idx) => {
      const num = idx + 1;
      const done = num < current;
      const active = num === current;
      return (
        <Fragment key={label}>
          <div className='flex flex-col items-center gap-1'>
            <div
              className={clsx(
                'size-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                active
                  ? 'bg-[#007BFF] border-[#007BFF] text-white'
                  : done
                  ? 'bg-[#5CB85C] border-[#5CB85C] text-white'
                  : 'bg-white border-[#D0D5DD] text-[#98A2B3]',
              )}
            >
              {done ? (
                <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
                  <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              ) : (
                num
              )}
            </div>
            <span
              className={clsx(
                'text-[10px] font-medium',
                active ? 'text-[#007BFF]' : done ? 'text-[#5CB85C]' : 'text-[#98A2B3]',
              )}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={clsx('flex-1 h-0.5 mx-2 mb-4', done ? 'bg-[#5CB85C]' : 'bg-[#D0D5DD]')} />
          )}
        </Fragment>
      );
    })}
  </div>
);

export function BookingWrapper({ id, doctor, calendar, countries, reviews, reviewsTotal }: BookingWrapperProps) {
  const firstAvailable = calendar.find((d) => d.is_available);

  const [selectedDate, setSelectedDate] = useState(firstAvailable?.date ?? '');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [filteredTimes, setFilteredTimes] = useState<string[] | null>(null);
  const [filteredServices, setFilteredServices] = useState<ApiService[] | null>(null);
  const [isTimesLoading, setIsTimesLoading] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{ url: string; amount: number } | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [errors, setErrors] = useState({ date: false, time: false, services: false });
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setFilteredServices(null);
    setErrors((prev) => ({ ...prev, date: false }));
    setCurrentStep(2);

    if (selectedServices.length === 0) {
      setFilteredTimes(null);
      return;
    }
    setIsTimesLoading(true);
    try {
      const res = await getProfessionalAvailableTimes(id, { date, service_ids: selectedServices });
      setFilteredTimes(res.times);
    } catch {
      setFilteredTimes(null);
    } finally {
      setIsTimesLoading(false);
    }
  };

  const handleTimeChange = async (time: string) => {
    setSelectedTime(time);
    setErrors((prev) => ({ ...prev, time: false }));
    if (time) setCurrentStep(3);

    if (!time || !selectedDate) return;
    setIsServicesLoading(true);
    try {
      const res = await getProfessionalAvailableServices(id, { date: selectedDate, time });
      setFilteredServices(res.data);
    } catch {
      setFilteredServices(null);
    } finally {
      setIsServicesLoading(false);
    }
  };

  const handleServicesChange = async (serviceIds: number[]) => {
    setSelectedServices(serviceIds);
    setErrors((prev) => ({ ...prev, services: false }));

    if (serviceIds.length === 0) {
      setFilteredTimes(null);
      return;
    }
    if (!selectedDate) return;
    setIsTimesLoading(true);
    try {
      const res = await getProfessionalAvailableTimes(id, { date: selectedDate, service_ids: serviceIds });
      setFilteredTimes(res.times);
      if (selectedTime && !res.times.includes(selectedTime)) {
        setSelectedTime('');
        setCurrentStep(2);
      }
    } catch {
      setFilteredTimes(null);
    } finally {
      setIsTimesLoading(false);
    }
  };

  const handleBooking = () => {
    const isDateInvalid = !selectedDate;
    const isTimeInvalid = !selectedTime;
    const isServicesInvalid = selectedServices.length === 0;

    setErrors({ date: isDateInvalid, time: isTimeInvalid, services: isServicesInvalid });

    if (isDateInvalid) { setCurrentStep(1); return; }
    if (isTimeInvalid) { setCurrentStep(2); return; }
    if (isServicesInvalid) { setCurrentStep(3); return; }

    setIsPhoneModalOpen(true);
  };

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setPhoneError('');
    setIsPhoneLoading(true);
    try {
      await sendOtp({ phone: phoneNumber });
      setCurrentPhone(phoneNumber);
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
      await sendOtp({ phone: currentPhone });
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
        const profileRes = await completeProfile({ phone: currentPhone }, verifyResult.code!);
        access_token = profileRes.access_token;
      }
      setToken(access_token);
      localStorage.setItem('saved_phone', currentPhone);

      try {
        await submitBooking(access_token);
      } catch (err) {
        const e = err as ApiError;
        if (e.error === 'payment_required') {
          const branchId = Number(e.details?.branch_id);
          const paylink = await createPaylink(branchId, access_token);
          setPaymentInfo({ url: paylink.paylink_url, amount: paylink.amount });
          setPaymentError('');
          setIsOtpModalOpen(false);
          setIsPaymentModalOpen(true);
          return;
        }
        if (e.error === 'payment_not_paid') {
          setPaymentError('Платёж ещё не подтверждён. Подождите немного и попробуйте снова.');
          setIsOtpModalOpen(false);
          setIsPaymentModalOpen(true);
          return;
        }
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

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24 lg:pb-0'>

        {/* Left column: doctor card + reviews (desktop — в одной ячейке, без gap) */}
        <div className='lg:col-start-1 lg:row-start-1 mx-4 flex flex-col gap-4'>
          <DoctorsDetailsCard doctor={doctor} />
          <div className='hidden lg:block'>
            <ReviewsBlock reviews={reviews} total={reviewsTotal} />
          </div>
        </div>

        {/* Right column: step indicator at top + step content (both mobile & desktop) */}
        <div className='lg:col-start-2 lg:row-start-1 mx-4 lg:mx-0 flex flex-col gap-3'>

          {/* Step indicator */}
          <div className='bg-white rounded-2xl px-4 py-4 shadow-sm'>
            <StepIndicator current={currentStep} />
          </div>

          {/* Back button */}
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((p) => (p - 1) as 1 | 2 | 3)}
              className='flex items-center gap-1.5 text-sm text-[#6B6B6B] font-medium self-start'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M10 12L6 8L10 4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              Назад
            </button>
          )}

          {/* Step content */}
          {(currentStep === 1 || currentStep === 2) && (
            <div className='relative'>
              {errors.date && currentStep === 1 && <Tooltip text='Пожалуйста, выберите дату' />}
              {errors.time && currentStep === 2 && <Tooltip text='Пожалуйста, выберите время' />}
              <DoctorsSchedule
                calendar={calendar}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                selectedTime={selectedTime}
                onTimeChange={handleTimeChange}
                isDateError={errors.date}
                isTimeError={errors.time}
                overrideTimes={filteredTimes}
                isTimesLoading={isTimesLoading}
                showSection={currentStep === 1 ? 'date' : 'time'}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div
              className={clsx(
                'rounded-2xl transition-all duration-300 relative border-2',
                errors.services ? 'border-red-500' : 'border-transparent',
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

          {/* Desktop book button */}
          <div className='hidden lg:flex flex-col items-center gap-3 pt-2 pb-4'>
            {(selectedDate || selectedTime) && (
              <div className='flex items-center gap-2 text-sm font-semibold text-[#333] bg-[#FAF9F9] border border-white rounded-full px-5 py-2 shadow-sm'>
                {selectedDate && <span>{selectedDate}</span>}
                {selectedDate && selectedTime && <span className='text-[#B3B3B3]'>·</span>}
                {selectedTime && <span>{selectedTime}</span>}
                {selectedServices.length > 0 && (
                  <>
                    <span className='text-[#B3B3B3]'>·</span>
                    <span>
                      {selectedServices.length === 1
                        ? (filteredServices ?? doctor.services).find((s) => s.id === selectedServices[0])?.name ?? 'Услуга'
                        : `${selectedServices.length} услуги`}
                    </span>
                  </>
                )}
              </div>
            )}
            <button
              onClick={handleBooking}
              className='bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-77 h-10.25 text-base rounded-full shadow-md active:scale-95 transition-all'
            >
              Записаться
            </button>
          </div>
        </div>

        {/* Reviews: mobile only — after step content */}
        <div className='lg:hidden mx-4 pb-24'>
          <ReviewsBlock reviews={doctor.reviews.items} total={doctor.reviews.total_count} />
        </div>

      </div>

      {/* Fixed mobile bottom */}
      <div className='fixed lg:hidden left-1/2 font-semibold -translate-x-1/2 rounded-full bottom-15 shadow-2xl flex justify-center items-center text-sm h-7.5 w-36.75 bg-[#FAF9F9] z-10 border border-white'>
        {selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : 'Выберите время'}
      </div>

      <button
        onClick={handleBooking}
        className='fixed lg:hidden left-1/2 -translate-x-1/2 bottom-4 text-sm bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-50.75 md:w-[80%] max-w-200 py-2.5 rounded-full shadow-xl active:scale-95 transition-all z-40'
      >
        Записаться
      </button>

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
