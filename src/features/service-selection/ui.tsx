'use client';

import { useState } from 'react';
import clsx from 'clsx';

const INITIAL_SERVICES = [
  { id: 1, name: 'Общий осмотр', price: 1500, isSelected: false },
  { id: 2, name: 'Осмотр в зеркалах', price: 1500, isSelected: false },
  { id: 3, name: 'Сдача анализов', price: 1500, isSelected: false },
  { id: 4, name: 'Планирование семьи', price: 1500, isSelected: false },
  { id: 5, name: 'Лечение бесплодия', price: 1500, isSelected: false },
  { id: 6, name: 'Сбор анамнеза', price: 1500, isSelected: false },
  { id: 7, name: 'Повторный прием', price: 1500, isSelected: false },
];

export function ServicesSelection() {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const toggleService = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, isSelected: !service.isSelected }
          : service,
      ),
    );
  };

  return (
    <div className='bg-white rounded-2xl py-5 px-4 shadow-sm'>
      <div className='grid grid-cols-[32px_1fr_80px] items-center gap-3 mb-4 px-1 text-xl font-medium text-[#333]'>
        <span>Услуги</span>
        <div />
        <span className='text-right'>Цены</span>
      </div>

      <div className='flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar'>
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => toggleService(service.id)}
            className='grid grid-cols-[32px_1fr_80px] items-center gap-3 px-1 text-left hover:bg-gray-50 transition-colors rounded-lg py-1'
          >
            <div
              className={clsx(
                'size-6 rounded-sm border-2 flex justify-center items-center transition-colors',
                service.isSelected
                  ? 'bg-[#5CB85C] border-[#5CB85C]'
                  : 'border-gray-300',
              )}
            >
              {service.isSelected && (
                <svg width='12' height='10' viewBox='0 0 12 10' fill='none'>
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

            <span className='text-[17px] text-[#333] font-medium leading-tight'>
              {service.name}
            </span>

            <span className='text-[17px] text-[#333] font-medium text-right'>
              {service.price}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
