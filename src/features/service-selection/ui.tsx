'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { ApiService } from '@/shared/mock';

interface ServicesSelectionProps {
  services: ApiService[];
  selectedServices: number[];
  onChange: (services: number[]) => void;
  isLoading?: boolean;
}

const serviceWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'услуга';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'услуги';
  return 'услуг';
};

const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
};

// Порог, после которого описание услуги обрезается и появляется «Подробнее»
const DESCRIPTION_CLAMP_LENGTH = 70;

function ServiceRow({
  service,
  isSelected,
  onToggle,
}: {
  service: ApiService;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDescriptionLong = (service.description?.length ?? 0) > DESCRIPTION_CLAMP_LENGTH;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 py-3.5 px-2 -mx-1 rounded-lg transition-colors',
        isSelected ? 'bg-[#F4FAF5]' : 'hover:bg-[#F8FAFC]',
      )}
    >
      <button
        type='button'
        onClick={onToggle}
        className='flex items-start gap-3 flex-1 min-w-0 text-left'
      >
        <span
          className={clsx(
            'size-5.5 shrink-0 rounded-md border-2 flex justify-center items-center transition-colors mt-px',
            isSelected
              ? 'bg-[#5CB85C] border-[#5CB85C]'
              : 'border-[#CBD2DC] bg-white',
          )}
        >
          {isSelected && (
            <svg width='11' height='9' viewBox='0 0 12 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M1 5.2L4.2 8.4L10.6 2'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </span>

        <span className='flex-1 min-w-0 flex flex-col gap-0.5'>
          <span className='text-[13px] md:text-sm text-dark font-semibold leading-snug'>
            {service.name}
          </span>
          {service.description && (
            <span
              className={clsx(
                'text-[11px] md:text-xs text-[#98A2B3] leading-snug whitespace-pre-line',
                isDescriptionLong && !isExpanded && 'line-clamp-2',
              )}
            >
              {service.description}
            </span>
          )}
        </span>
      </button>

      <span className='flex flex-col items-end gap-1 shrink-0 mt-px'>
        <span
          className={clsx(
            'text-[13px] md:text-sm font-semibold tabular-nums whitespace-nowrap',
            isSelected ? 'text-[#2E9A46]' : 'text-dark',
          )}
        >
          {service.price.toLocaleString('ru-RU')} с
        </span>
        {typeof service.duration_min === 'number' && service.duration_min > 0 && (
          <span className='flex items-center gap-1 text-[10px] text-[#B3B8C2] font-medium whitespace-nowrap'>
            <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='12' cy='12' r='10' />
              <polyline points='12 6 12 12 16 14' />
            </svg>
            {formatDuration(service.duration_min)}
          </span>
        )}
        {isDescriptionLong && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((p) => !p);
            }}
            className='text-[10px] font-semibold text-[#007BFF] hover:text-[#0069D9] transition-colors whitespace-nowrap'
          >
            {isExpanded ? 'Свернуть' : 'Подробнее'}
          </button>
        )}
      </span>
    </div>
  );
}

export function ServicesSelection({
  services,
  selectedServices,
  onChange,
  isLoading,
}: ServicesSelectionProps) {
  const toggleService = (id: number) => {
    const newServices = selectedServices.includes(id)
      ? selectedServices.filter((item) => item !== id)
      : [...selectedServices, id];

    onChange(newServices);
  };

  const chosen = services.filter((s) => selectedServices.includes(s.id));
  const totalPrice = chosen.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = chosen.every((s) => typeof s.duration_min === 'number')
    ? chosen.reduce((sum, s) => sum + (s.duration_min ?? 0), 0)
    : null;

  return (
    <div className='bg-white rounded-2xl p-4 md:p-5 shadow-sm'>
      <div className='flex items-baseline justify-between mb-2'>
        <span className='text-[15px] font-semibold text-dark'>
          Выберите услуги
        </span>
        {!isLoading && services.length > 0 && (
          <span className='text-[11px] text-[#98A2B3] font-medium'>
            {services.length} {serviceWord(services.length)}
          </span>
        )}
      </div>

      <div className='flex flex-col max-h-80 overflow-y-auto pr-2 custom-scrollbar divide-y divide-[#F0F1F4]'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-start gap-3 py-3.5 px-1 animate-pulse'>
              <div className='size-5.5 rounded-md bg-gray-200 shrink-0' />
              <div className='flex-1 flex flex-col gap-1.5'>
                <div className='h-4 bg-gray-200 rounded w-2/3' />
                <div className='h-3 bg-gray-100 rounded w-1/2' />
              </div>
              <div className='h-4 bg-gray-200 rounded w-14' />
            </div>
          ))
        ) : services.length === 0 ? (
          <div className='flex flex-col items-center gap-2 py-8 text-center'>
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='#C6CAD2' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <path d='M16 10a4 4 0 0 1-8 0' />
            </svg>
            <span className='text-[#98A2B3] text-sm'>
              На выбранное время нет доступных услуг — попробуйте другое время
            </span>
          </div>
        ) : (
          services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onToggle={() => toggleService(service.id)}
            />
          ))
        )}
      </div>

      {chosen.length > 0 && (
        <div className='flex items-center justify-between border-t border-[#F0F1F4] mt-1 pt-3'>
          <span className='text-xs text-gray font-medium'>
            {chosen.length} {serviceWord(chosen.length)}
            {totalDuration != null && totalDuration > 0 && (
              <> · {formatDuration(totalDuration)}</>
            )}
          </span>
          <span className='text-[15px] font-bold text-[#007BFF] tabular-nums'>
            {totalPrice.toLocaleString('ru-RU')} с
          </span>
        </div>
      )}
    </div>
  );
}
