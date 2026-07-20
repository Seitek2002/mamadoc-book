'use client';

import { useEffect, useRef } from 'react';
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
  onLoadMoreDays?: () => void;
  isLoadingMoreDays?: boolean;
  hasMoreDays?: boolean;
}

const formatDayLong = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

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
  onLoadMoreDays,
  isLoadingMoreDays,
  hasMoreDays,
}: DoctorsScheduleProps) => {
  const datesScrollRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  // Список дат может докручиваться и горизонтально (мобильная лента), и
  // вертикально (десктопная сетка) — наблюдаем видимость сентинела
  // относительно самого скролл-контейнера, это работает для обеих осей.
  useEffect(() => {
    if (!onLoadMoreDays || !hasMoreDays) return;
    const root = datesScrollRef.current;
    const sentinel = loadMoreSentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMoreDays();
      },
      { root, rootMargin: '200px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMoreDays, hasMoreDays]);

  const selectedDay = calendar.find((day) => day.date === selectedDate);
  // С выбранными услугами сервер отдаёт полную сетку дня с флагом busy —
  // занятые слоты показываем серыми и некликабельными. Без услуг календарь
  // содержит только свободные слоты.
  const currentSlots: ApiTimeSlot[] =
    overrideTimes ?? (selectedDay?.times ?? []).map((time) => ({ time, busy: false }));

  const hasBusy = currentSlots.some((slot) => slot.busy);

  return (
    <div className='bg-white rounded-2xl p-4 md:p-5 h-full w-full flex flex-col gap-4 shadow-sm'>
      <div
        className={clsx(
          'rounded-xl border-2 transition-all -m-1 p-1',
          isDateError ? 'border-red-400' : 'border-transparent',
        )}
      >
        <div className='flex items-baseline justify-between mb-3'>
          <span
            className={clsx(
              'text-[15px] font-semibold',
              isDateError ? 'text-red-500' : 'text-dark',
            )}
          >
            Выберите дату
          </span>
          <span className='text-[11px] text-[#98A2B3] font-medium'>
            {calendar.length <= 30 ? 'ближайшие 30 дней' : `показано ${calendar.length} дней`}
          </span>
        </div>
        <div
          ref={datesScrollRef}
          className='flex gap-2 overflow-x-auto snap-x pb-1.5 custom-scrollbar md:grid md:grid-cols-6 xl:grid-cols-7 md:overflow-x-visible md:overflow-y-auto md:max-h-75 md:pb-0 md:pr-1'
        >
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
          {hasMoreDays && (
            <div
              ref={loadMoreSentinelRef}
              className='shrink-0 w-1 md:w-auto md:h-1 md:col-span-full'
              aria-hidden
            />
          )}
          {isLoadingMoreDays && (
            <div className='shrink-0 w-16.5 md:w-auto h-22 rounded-xl border border-[#F0F1F4] flex items-center justify-center md:col-span-full md:h-10'>
              <svg className='size-4 animate-spin text-[#98A2B3]' viewBox='0 0 24 24' fill='none'>
                <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' className='opacity-25' />
                <path d='M12 2a10 10 0 0 1 10 10' stroke='currentColor' strokeWidth='4' strokeLinecap='round' />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Время появляется только после выбора даты — до этого показывать нечего */}
      {selectedDate && (
        <div
          className={clsx(
            'rounded-xl border-2 transition-all -m-1 p-1 animate-in fade-in slide-in-from-top-2 duration-300',
            isTimeError ? 'border-red-400' : 'border-transparent',
          )}
        >
          <div className='flex items-baseline justify-between mb-1 border-t border-[#F0F1F4] pt-4'>
            <span
              className={clsx(
                'text-[15px] font-semibold',
                isTimeError ? 'text-red-500' : 'text-dark',
              )}
            >
              Выберите время
            </span>
            <span className='text-[11px] text-[#98A2B3] font-medium'>
              {formatDayLong(selectedDate)}
            </span>
          </div>

          {hasBusy && !isTimesLoading && (
            <div className='flex items-center gap-4 mb-3'>
              <span className='flex items-center gap-1.5 text-[11px] text-gray'>
                <span className='size-2 rounded-full bg-white border border-[#C9CDD4]' />
                Свободно
              </span>
              <span className='flex items-center gap-1.5 text-[11px] text-gray'>
                <span className='size-2 rounded-full bg-[#E2E4E9]' />
                Занято
              </span>
            </div>
          )}
          {(!hasBusy || isTimesLoading) && <div className='mb-2' />}

          {isTimesLoading ? (
            <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='h-10 rounded-xl bg-gray-100 animate-pulse' />
              ))}
            </div>
          ) : currentSlots.length > 0 ? (
            <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2'>
              {currentSlots.map((slot, idx) => (
                <button
                  key={`${selectedDate}-${slot.time}-${idx}`}
                  type='button'
                  onClick={slot.busy ? undefined : () => onTimeChange(slot.time)}
                  disabled={slot.busy}
                  aria-disabled={slot.busy}
                  className={clsx(
                    'h-10 rounded-xl border text-sm font-semibold tabular-nums transition-all',
                    slot.busy
                      ? 'bg-[#F5F6F8] border-transparent text-[#C6CAD2] line-through cursor-not-allowed'
                      : selectedTime === slot.time
                      ? 'bg-[#007BFF] border-[#007BFF] text-white shadow-[0_4px_12px_rgba(0,123,255,0.3)] cursor-pointer'
                      : 'bg-white border-[#E7E7EE] text-dark hover:border-[#007BFF] hover:text-[#007BFF] cursor-pointer',
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2 py-8 text-center'>
              <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='#C6CAD2' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='12' cy='12' r='10' />
                <polyline points='12 6 12 12 16 14' />
              </svg>
              <span className='text-[#98A2B3] text-sm'>На этот день нет доступного времени</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
