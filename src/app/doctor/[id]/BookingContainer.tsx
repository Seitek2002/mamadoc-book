'use client';

import { useState, useRef } from 'react';
import clsx from 'clsx';
import { DoctorsDetailsCard } from '@/widgets';
import { DoctorsSchedule, ServicesSelection } from '@/features';

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
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Состояние ошибок для подсветки бордеров и показа тултипов
  const [errors, setErrors] = useState({
    schedule: false,
    services: false,
  });

  // Рефы для скролла
  const scheduleRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

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

    // Если всё ок, выводим данные или отправляем на сервер
    console.log('Данные готовы для отправки:', {
      doctorId: id,
      selectedDate,
      selectedTime,
      selectedServices,
    });
    alert('Все данные успешно собраны!');
  };

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start pb-24'>
        <div className='lg:col-start-1 lg:row-start-1'>
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
            onDateChange={(val) => {
              setSelectedDate(val);
              setErrors((prev) => ({ ...prev, schedule: false }));
            }}
            selectedTime={selectedTime}
            onTimeChange={(val) => {
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
            onChange={(val) => {
              setSelectedServices(val);
              setErrors((prev) => ({ ...prev, services: false }));
            }}
          />
        </div>
      </div>

      <button
        onClick={handleBooking}
        className='fixed left-[10%] bottom-4 text-2xl bg-[#5CB85C] hover:bg-[#4cae4c] font-medium text-white w-[80%] py-4 rounded-full shadow-xl active:scale-95 transition-all z-50'
      >
        Записаться
      </button>
    </>
  );
}
