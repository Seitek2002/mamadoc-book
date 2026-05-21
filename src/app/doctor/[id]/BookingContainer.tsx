'use client';

import { useState, useRef } from 'react';
import clsx from 'clsx';
import { DoctorsDetailsCard } from '@/widgets';
import {
  DoctorsSchedule,
  ServicesSelection,
  PhoneModal,
  OTPModal,
  SuccessModal,
} from '@/features';
import type { ApiDoctorDetail, ApiCalendarDay, ApiPhoneCountry } from '@/shared/mock';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  createBooking,
  setToken,
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
}

const Tooltip = ({ text }: { text: string }) => (
  <div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 whitespace-nowrap'>
    {text}
    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45' />
  </div>
);

export function BookingWrapper({ id, doctor, calendar, countries }: BookingWrapperProps) {
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
  const [currentPhone, setCurrentPhone] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [errors, setErrors] = useState({ date: false, time: false, services: false });

  const scheduleRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setFilteredServices(null);
    setErrors((prev) => ({ ...prev, date: false }));

    if (selectedServices.length === 0) {
      setFilteredTimes(null);
      return;
    }
    setIsTimesLoading(true);
    try {
      const res = await getProfessionalAvailableTimes(id, { date, service_ids: selectedServices });
      setFilteredTimes(res.data);
    } catch {
      setFilteredTimes(null);
    } finally {
      setIsTimesLoading(false);
    }
  };

  const handleTimeChange = async (time: string) => {
    setSelectedTime(time);
    setErrors((prev) => ({ ...prev, time: false }));

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
    setSelectedTime('');
    try {
      const res = await getProfessionalAvailableTimes(id, { date: selectedDate, service_ids: serviceIds });
      setFilteredTimes(res.data);
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

    if (isDateInvalid || isTimeInvalid) {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (isServicesInvalid) {
      servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

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

  const handleOtpSubmit = async (otpCode: string) => {
    setOtpError('');
    setIsOtpLoading(true);
    try {
      const { registration_token } = await verifyOtp({ phone: currentPhone, code: otpCode });
      const { access_token } = await completeProfile({ phone: currentPhone }, registration_token);
      setToken(access_token);

      const result = await createBooking(
        {
          doctor_id: Number(id),
          date: selectedDate,
          time: selectedTime,
          service_ids: selectedServices,
        },
        access_token,
      );

      setBookingResult(result.data);
      setIsOtpModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      const e = err as ApiError;
      setOtpError(e.message ?? 'Ошибка записи');
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24 lg:pb-0'>
        <div className='lg:col-start-1 lg:row-start-1 mx-4'>
          <DoctorsDetailsCard doctor={doctor} />
        </div>

        <div
          ref={scheduleRef}
          className='lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl transition-all duration-300 relative flex flex-col'
        >
          {errors.date && <Tooltip text='Пожалуйста, выберите дату' />}
          {errors.time && !errors.date && <Tooltip text='Пожалуйста, выберите время' />}

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
          />

          <div className='hidden lg:flex justify-center w-full pt-4 pb-8'>
            <button
              onClick={handleBooking}
              className='bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-77 h-10.25 text-base rounded-full shadow-md active:scale-95 transition-all'
            >
              Записаться
            </button>
          </div>
        </div>

        <div
          ref={servicesRef}
          className={clsx(
            'lg:col-start-1 lg:row-start-2 rounded-2xl transition-all duration-300 relative border-2',
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
      </div>

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

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        booking={bookingResult}
      />
    </>
  );
}
