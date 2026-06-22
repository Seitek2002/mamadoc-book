'use client';

import clsx from 'clsx';
import type { ApiService } from '@/shared/mock';

interface ServicesSelectionProps {
  services: ApiService[];
  selectedServices: number[];
  onChange: (services: number[]) => void;
  isLoading?: boolean;
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

  return (
    <div className='bg-white rounded-2xl py-5 px-4 shadow-sm'>
      <div className='grid grid-cols-[32px_1fr_80px] items-center gap-3 mb-4 px-1 text-xl font-medium text-[#333]'>
        <span>Услуги</span>
        <div />
        <span className=''>Цены</span>
      </div>

      <div className='flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='grid grid-cols-[32px_1fr_70px] items-center gap-3 px-1 animate-pulse'>
              <div className='size-6 rounded-sm bg-gray-200' />
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-4 bg-gray-200 rounded w-12' />
            </div>
          ))
        ) : services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className='grid grid-cols-[32px_1fr_70px] lg:grid-cols-[32px_1fr_60px] items-start gap-3 px-1 text-left hover:bg-gray-50 transition-colors rounded-lg py-1'
            >
              <div
                className={clsx(
                  'size-6 rounded-sm border-2 flex justify-center items-center transition-colors mt-0.5',
                  isSelected
                    ? 'bg-[#5CB85C] border-[#5CB85C]'
                    : 'border-gray-300',
                )}
              >
                {isSelected && (
                  <svg
                    width='12'
                    height='10'
                    viewBox='0 0 12 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 5.2L4.2 8.4L10.6 2'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-[12px] lg:text-[14px] text-[#333] font-medium leading-tight'>
                  {service.name}
                </span>
                {service.description && (
                  <span className='text-[11px] text-[#9E9E9E] leading-snug whitespace-pre-line'>
                    {service.description}
                  </span>
                )}
              </div>
              <span className='text-[12px] lg:text-[14px] text-[#333] font-medium text-left mt-0.5'>
                {service.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
