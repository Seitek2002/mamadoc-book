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

// Вспомогательный компонент Тултипа
const Tooltip = ({ text }: { text: string }) => (
  <div className='absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 whitespace-nowrap'>
    {text}
    <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45' />
  </div>
);

export function BookingWrapper({ id }: BookingWrapperProps) {
  const calendar = DOCTORS_DETAILS_LIST[+id - 1].availabilityCalendar;

  // Стейты данных формы
  const [selectedDate, setSelectedDate] = useState(calendar[0].date);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Стейты модальных окон
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [currentPhone, setCurrentPhone] = useState('');

  // Состояние ошибок
  const [errors, setErrors] = useState({
    schedule: false,
    services: false,
  });

  // Рефы для скролла
  const scheduleRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Валидация и старт процесса записи
  const handleBooking = () => {
    const isScheduleInvalid = !selectedDate || !selectedTime;
    const isServicesInvalid = selectedServices.length === 0;

    setErrors({
      schedule: isScheduleInvalid,
      services: isServicesInvalid,
    });

    if (isScheduleInvalid) {
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

    // Если всё ок — открываем модалку для ввода номера
    setIsPhoneModalOpen(true);
  };

  // Шаг 1: Пользователь ввел телефон
  const handlePhoneSubmit = (phoneNumber: string) => {
    setCurrentPhone(phoneNumber);
    setIsPhoneModalOpen(false);
    setIsOtpModalOpen(true); // Открываем второй шаг (OTP)
  };

  // Шаг 2: Пользователь ввел OTP
  const handleOtpSubmit = (otpCode: string) => {
    // Здесь итоговая отправка данных на сервер
    console.log('Отправляем данные на сервер:', {
      doctorId: id,
      selectedDate,
      selectedTime,
      selectedServices,
      phone: currentPhone,
      otp: otpCode,
    });

    setIsOtpModalOpen(false);
    setIsSuccessModalOpen(true); // Открываем финальный шаг (Успех)
  };

  // Шаг 3: Закрытие финального окна
  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    // Опционально: очистка формы после успешной записи
    // setSelectedDate('');
    // setSelectedTime('');
    // setSelectedServices([]);
  };

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24'>
        <div className='lg:col-start-1 lg:row-start-1 mx-4'>
          <DoctorsDetailsCard id={id} />
        </div>

        {/* Секция Расписания */}
        <div
          ref={scheduleRef}
          className={clsx(
            'lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl transition-all duration-300 relative border-2',
            errors.schedule ? 'border-red-500' : 'border-transparent',
          )}
        >
          {errors.schedule && (
            <Tooltip text='Пожалуйста, выберите дату и время' />
          )}
          <DoctorsSchedule
            id={id}
            selectedDate={selectedDate}
            onDateChange={(val: string) => {
              setSelectedDate(val);
              setErrors((prev) => ({ ...prev, schedule: false }));
            }}
            selectedTime={selectedTime}
            onTimeChange={(val: string) => {
              setSelectedTime(val);
              setErrors((prev) => ({ ...prev, schedule: false }));
            }}
          />
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

      <button
        onClick={handleBooking}
        className='fixed left-1/2 -translate-x-1/2 bottom-4 text-2xl bg-[#007BFF] hover:bg-[#0069D9] font-medium text-white w-[90%] md:w-[80%] max-w-200 py-4 rounded-full shadow-xl active:scale-95 transition-all z-40'
      >
        Записаться
      </button>

      {/* Модальное окно ввода номера телефона */}
      <PhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onContinue={handlePhoneSubmit}
      />

      {/* Модальное окно ввода OTP кода */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSubmit={handleOtpSubmit}
        phoneNumber={currentPhone}
      />

      {/* Модальное окно успеха */}
      <SuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessClose} />
    </>
  );
}
