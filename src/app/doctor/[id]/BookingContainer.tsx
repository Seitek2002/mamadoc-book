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
import { DOCTORS_DETAILS_LIST } from '@/shared/assets/images/doctors';

interface BookingWrapperProps {
  id: string;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 whitespace-nowrap'>
    {text}
    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45' />
  </div>
);

export function BookingWrapper({ id }: BookingWrapperProps) {
  const calendar = DOCTORS_DETAILS_LIST[+id - 1].availabilityCalendar;

  const [selectedDate, setSelectedDate] = useState(calendar[0].date);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  // Разделили ошибку расписания на дату и время
  const [errors, setErrors] = useState({
    date: false,
    time: false,
    services: false,
  });

  const scheduleRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const handleBooking = () => {
    const isDateInvalid = !selectedDate;
    const isTimeInvalid = !selectedTime;
    const isServicesInvalid = selectedServices.length === 0;

    setErrors({
      date: isDateInvalid,
      time: isTimeInvalid,
      services: isServicesInvalid,
    });

    if (isDateInvalid || isTimeInvalid) {
      scheduleRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    if (isServicesInvalid) {
      servicesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    setIsPhoneModalOpen(true);
  };

  const handlePhoneSubmit = (phoneNumber: string) => {
    setCurrentPhone(phoneNumber);
    setIsPhoneModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handleOtpSubmit = (otpCode: string) => {
    console.log('Отправляем данные на сервер:', {
      doctorId: id,
      selectedDate,
      selectedTime,
      selectedServices,
      phone: currentPhone,
      otp: otpCode,
    });
    setIsOtpModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24 lg:pb-0'>
        <div className='lg:col-start-1 lg:row-start-1 mx-4'>
          <DoctorsDetailsCard id={id} />
        </div>

        {/* Секция Расписания */}
        <div
          ref={scheduleRef}
          className='lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl transition-all duration-300 relative flex flex-col'
        >
          {errors.date && <Tooltip text='Пожалуйста, выберите дату' />}
          {errors.time && !errors.date && <Tooltip text='Пожалуйста, выберите время' />}
          
          <DoctorsSchedule
            id={id}
            selectedDate={selectedDate}
            onDateChange={(val: string) => {
              setSelectedDate(val);
              setErrors((prev) => ({ ...prev, date: false }));
            }}
            selectedTime={selectedTime}
            onTimeChange={(val: string) => {
              setSelectedTime(val);
              setErrors((prev) => ({ ...prev, time: false }));
            }}
            isDateError={errors.date}
            isTimeError={errors.time}
          />

          {/* ДЕСКТОПНАЯ КНОПКА ЗАПИСИ */}
          <div className='hidden lg:flex justify-center w-full pt-4 pb-8'>
            <button
              onClick={handleBooking}
              className='bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-77 h-10.25 text-base rounded-full shadow-md active:scale-95 transition-all'
            >
              Записаться
            </button>
          </div>
        </div>

        {/* Секция Услуг */}
        <div
          ref={servicesRef}
          className={clsx(
            'lg:col-start-1 lg:row-start-2 rounded-2xl transition-all duration-300 relative border-2',
            errors.services ? 'border-red-500' : 'border-transparent',
          )}
        >
          {errors.services && (
            <Tooltip text='Пожалуйста, выберите хотя бы одну услугу' />
          )}
          <ServicesSelection
            selectedServices={selectedServices}
            onChange={(val: number[]) => {
              setSelectedServices(val);
              setErrors((prev) => ({ ...prev, services: false }));
            }}
          />
        </div>
      </div>

      <div className='fixed lg:hidden left-1/2 font-semibold -translate-x-1/2 rounded-full bottom-15 shadow-2xl flex justify-center items-center text-sm h-7.5 w-36.75 bg-[#FAF9F9] z-10 border border-white'>
        13 марта, 13:00
      </div>

      <button
        onClick={handleBooking}
        className='fixed lg:hidden left-1/2 -translate-x-1/2 bottom-4 text-sm bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-50.75 md:w-[80%] max-w-200 py-2.5 rounded-full shadow-xl active:scale-95 transition-all z-40'
      >
        Записаться
      </button>

      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onContinue={handlePhoneSubmit}
      />

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmit={handleOtpSubmit}
        phoneNumber={currentPhone}
      />

      <SuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessClose} />
    </>
  );
}