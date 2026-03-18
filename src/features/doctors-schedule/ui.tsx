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
}

export const DoctorsSchedule = ({
  id,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
}: DoctorsScheduleProps) => {
  const calendar =
    DOCTORS_DETAILS_LIST[Number(id) - 1]?.availabilityCalendar || [];

  const selectedDay = calendar.find((day) => day.date === selectedDate);
  const currentSlots = selectedDay?.times || [];

  return (
    <div className='bg-white rounded-2xl py-5 h-full'>
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

      <div className='p-4 flex flex-wrap gap-3 border-t border-gray-100 mt-2'>
        {currentSlots.length > 0 ? (
          currentSlots.map((time, idx) => (
            <div
              key={`${selectedDate}-${time}-${idx}`}
              onClick={() => onTimeChange(time)}
              className={clsx(
                'w-18.75 h-6.5 flex justify-center items-center rounded-full cursor-pointer transition-all',
                selectedTime === time
                  ? 'bg-[#5CB85C]'
                  : 'bg-[#736767] hover:bg-opacity-80',
              )}
            >
              <span className='text-white text-xs font-semibold'>{time}</span>
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
  );
};
