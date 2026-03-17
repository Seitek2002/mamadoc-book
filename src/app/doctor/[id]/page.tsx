import clsx from 'clsx';
import { DoctorsDetailsCard } from '@/widgets';
import { PageTitle } from '@/shared/ui';
import { DoctorsSchedule } from '@/features';

// Статичные данные прямо в файле
const SERVICES_DATA = [
  { id: 1, name: 'Общий осмотр', price: 1500, isSelected: true },
  { id: 2, name: 'Осмотр в зеркалах', price: 1500, isSelected: false },
  { id: 3, name: 'Сдача анализов', price: 1500, isSelected: false },
  { id: 4, name: 'Планирование семьи', price: 1500, isSelected: false },
  { id: 5, name: 'Лечение бесплодия', price: 1500, isSelected: false },
  { id: 6, name: 'Сбор анамнеза', price: 1500, isSelected: false },
  { id: 7, name: 'Повторный прием', price: 1500, isSelected: false },
];

async function DoctorsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className='max-w-7xl mx-auto p-4 md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>

      {/* Основной контейнер сетки */}
      <div className='grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 items-start'>
        {/* 1. Карточка доктора (всегда первая) */}
        <div className='lg:col-start-1 lg:row-start-1'>
          <DoctorsDetailsCard id={id} />
        </div>

        {/* 2. Расписание (на мобилке второе, на ПК — правая колонка) */}
        <div className='lg:col-start-2 lg:row-start-1 lg:row-span-2'>
          <DoctorsSchedule id={id} />
        </div>

        {/* 3. Услуги (на мобилке третьи, на ПК — под карточкой доктора) */}
        <div className='lg:col-start-1 lg:row-start-2'>
          <div className='bg-white rounded-2xl py-5 px-4 shadow-sm'>
            <div className='grid grid-cols-[32px_1fr_80px] items-center gap-3 mb-4 px-1 text-xl font-medium text-[#333]'>
              <span className=''>Услуги</span>
              <div />
              <span className='text-right'>Цены</span>
            </div>

            <div className='flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar'>
              {SERVICES_DATA.map((service) => (
                <div
                  key={service.id}
                  className='grid grid-cols-[32px_1fr_80px] items-center gap-3 px-1'
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

                  <span className='text-[17px] text-[#333] font-medium leading-tight'>
                    {service.name}
                  </span>

                  <span className='text-[17px] text-[#333] font-medium text-right'>
                    {service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorsPage;
