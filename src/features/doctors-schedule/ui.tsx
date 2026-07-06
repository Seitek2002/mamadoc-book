'use client';

import clsx from 'clsx';
import type { ApiCalendarDay, ApiTimeSlot } from '@/shared/mock';
import { DoctorsScheduleItem } from '@/shared/ui';

interface DoctorsScheduleProps {
  calendar: ApiCalendarDay[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  isDateError?: boolean;
  isTimeError?: boolean;
  overrideTimes?: ApiTimeSlot[] | null;
  isTimesLoading?: boolean;
  showSection?: 'date' | 'time' | 'all';
}

export const DoctorsSchedule = ({
  calendar,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  isDateError,
  isTimeError,
  overrideTimes,
  isTimesLoading,
  showSection = 'all',
}: DoctorsScheduleProps) => {

  const selectedDay = calendar.find((day) => day.date === selectedDate);
  // С выбранными услугами сервер отдаёт полную сетку дня с флагом busy —
  // занятые слоты показываем серыми и некликабельными. Без услуг календарь
  // содержит только свободные слоты.
  const currentSlots: ApiTimeSlot[] =
    overrideTimes ?? (selectedDay?.times ?? []).map((time) => ({ time, busy: false }));

  return (
    <div className='bg-white rounded-2xl py-5 h-full w-full flex flex-col gap-2'>
      {showSection !== 'time' && (
        <div
          className={clsx(
            'border-2 rounded-xl transition-all',
            isDateError ? 'border-red-500' : 'border-transparent',
          )}
        >
          <div className='grid grid-cols-4 gap-2 max-h-70 overflow-auto px-4 py-2 md:grid-cols-6 custom-scrollbar'>
            {calendar.map((el) => (
              <DoctorsScheduleItem
                key={el.date}
                data={el}
                isActive={selectedDate === el.date}
                onClick={() => {
                  onDateChange(el.date);
                  onTimeChange('');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {showSection !== 'date' && (
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
            {isTimesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='w-18.75 h-6.5 rounded-full bg-gray-200 animate-pulse' />
              ))
            ) : currentSlots.length > 0 ? (
              currentSlots.map((slot, idx) => (
                <div
                  key={`${selectedDate}-${slot.time}-${idx}`}
                  onClick={slot.busy ? undefined : () => onTimeChange(slot.time)}
                  aria-disabled={slot.busy}
                  className={clsx(
                    'w-18.75 h-6.5 flex justify-center items-center rounded-full transition-all border',
                    slot.busy
                      ? 'bg-[#F6F6F6] border-[#E7E7EE] text-[#B3B3B3] cursor-not-allowed'
                      : selectedTime === slot.time
                      ? 'bg-[#5CB85C] border-[#5CB85C] text-white cursor-pointer'
                      : 'bg-white border-[#B3B3B3] text-[#333] hover:border-[#5CB85C] hover:text-[#5CB85C] cursor-pointer',
                  )}
                >
                  <span className='text-xs font-semibold'>{slot.time}</span>
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
      )}
    </div>
  );
};
