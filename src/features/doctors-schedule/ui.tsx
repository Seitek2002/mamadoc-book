'use client';

import { useState } from 'react';
import { DOCTORS_DETAILS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsScheduleItem } from '@/shared/ui';

export const DoctorsSchedule = ({ id }: { id: string }) => {
  const calendar = DOCTORS_DETAILS_LIST[+id - 1].availabilityCalendar;

  const [selectedDate, setSelectedDate] = useState(calendar[0].date);

  const selectedDay = calendar.find((day) => day.date === selectedDate);
  const currentSlots = selectedDay?.times || [];

  return (
    <div className='bg-white rounded-2xl py-5 my-4'>
      <div className='grid grid-cols-4 gap-2 max-h-41.25 overflow-auto px-4 py-2'>
        {calendar.map((el) => (
          <DoctorsScheduleItem
            key={el.date}
            data={el}
            isActive={selectedDate === el.date}
            onClick={() => setSelectedDate(el.date)}
          />
        ))}
      </div>

      <div className='p-4 flex flex-wrap gap-3 border-t border-gray-100'>
        {currentSlots.length > 0 ? (
          currentSlots.map((time, idx) => (
            <div
              key={`${selectedDate}-${time}-${idx}`}
              className='w-18.75 h-6.5 flex justify-center items-center rounded-full bg-[#736767] cursor-pointer hover:bg-opacity-80 transition-all'
            >
              <span className='text-white text-xs font-semibold'>{time}</span>
            </div>
          ))
        ) : (
          <span className='text-gray-400 text-sm'>
            На этот день нет доступного времени
          </span>
        )}
      </div>
    </div>
  );
};
