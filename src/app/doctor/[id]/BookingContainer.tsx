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
import type { ApiDoctorDetail, ApiCalendarDay } from '@/shared/mock';
import {
  sendOtp,
  verifyOtp,
  createBooking,
  setToken,
  type BookingResult,
  type ApiError,
} from '@/shared/api';

interface BookingWrapperProps {
  id: string;
  doctor: ApiDoctorDetail;
  calendar: ApiCalendarDay[];
}

const Tooltip = ({ text }: { text: string }) => (
  <div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 whitespace-nowrap'>
    {text}
    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45' />
  </div>
);

export function BookingWrapper({ id, doctor, calendar }: BookingWrapperProps) {
  const firstAvailable = calendar.find((d) => d.is_available);

  const [selectedDate, setSelectedDate] = useState(firstAvailable?.date ?? '');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

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
      const auth = await verifyOtp({ phone: currentPhone, code: otpCode });
      setToken(auth.access_token);

      const result = await createBooking(
        {
          doctor_id: Number(id),
          date: selectedDate,
          time: selectedTime,
          service_ids: selectedServices,
        },
        auth.access_token,
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
            onDateChange={(val) => {
              setSelectedDate(val);
              setErrors((prev) => ({ ...prev, date: false }));
            }}
            selectedTime={selectedTime}
            onTimeChange={(val) => {
              setSelectedTime(val);
              setErrors((prev) => ({ ...prev, time: false }));
            }}
            isDateError={errors.date}
            isTimeError={errors.time}
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
            services={doctor.services}
            selectedServices={selectedServices}
            onChange={(val) => {
              setSelectedServices(val);
              setErrors((prev) => ({ ...prev, services: false }));
            }}
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
