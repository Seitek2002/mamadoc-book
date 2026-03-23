'use client';

import clsx from 'clsx';
import { DOCTORS_DETAILS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsScheduleItem } from '@/shared/ui';

interface DoctorsScheduleProps {
  id: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  isDateError?: boolean;
  isTimeError?: boolean;
}

export const DoctorsSchedule = ({
  id,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  isDateError,
  isTimeError,
}: DoctorsScheduleProps) => {
  const calendar =
    DOCTORS_DETAILS_LIST[Number(id) - 1]?.availabilityCalendar || [];

  const selectedDay = calendar.find((day) => day.date === selectedDate);
  const currentSlots = selectedDay?.times || [];

  return (
    <div className='bg-white rounded-2xl py-5 h-full w-full flex flex-col gap-2'>
      {/* Блок выбора даты */}
      <div
        className={clsx(
          'border-2 rounded-xl transition-all',
          isDateError ? 'border-red-500' : 'border-transparent',
        )}
      >
        <div className='grid grid-cols-4 gap-2 max-h-41.25 overflow-auto px-4 py-2 md:grid-cols-6 custom-scrollbar'>
          {calendar.map((el) => (
            <DoctorsScheduleItem
              key={el.date}
              data={el}
              isActive={selectedDate === el.date}
              onClick={() => {
                onDateChange(el.date);
                onTimeChange(''); // Сбрасываем выбранное время при смене даты
              }}
            />
          ))}
        </div>
      </div>

      {/* Блок выбора времени */}
      <div
        className={clsx(
          'px-4 py-3 rounded-xl border-2 transition-all',
          isTimeError ? 'border-red-500' : 'border-transparent',
        )}
      >
        <span
          className={clsx(
            'block text-sm font-semibold mb-3',
            isTimeError ? 'text-red-500' : 'text-[#333]',
          )}
        >
          {isTimeError ? 'Выберите время' : 'Доступное время приемов'}
        </span>

        <div className='flex flex-wrap gap-3'>
          {currentSlots.length > 0 ? (
            currentSlots.map((time, idx) => (
              <div
                key={`${selectedDate}-${time}-${idx}`}
                onClick={() => onTimeChange(time)}
                className={clsx(
                  'w-18.75 h-6.5 flex justify-center items-center rounded-full cursor-pointer transition-all border',
                  selectedTime === time
                    ? 'bg-[#5CB85C] border-[#5CB85C] text-white' // Выбранное состояние (зеленое)
                    : 'bg-white border-[#B3B3B3] text-[#333] hover:border-[#5CB85C] hover:text-[#5CB85C]', // Дефолтное по макету
                )}
              >
                {/* Убрал жесткий text-white отсюда, чтобы цвет текста наследовался от родителя (clsx) */}
                <span className='text-xs font-semibold'>{time}</span>
              </div>
            ))
          ) : (
            <span className='text-gray-400 text-sm'>
              {selectedDate
                ? 'На этот день нет доступного времени'
                : 'Выберите дату для просмотра времени'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
