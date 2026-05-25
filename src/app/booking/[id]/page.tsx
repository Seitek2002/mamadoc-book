import Image from 'next/image';
import Link from 'next/link';

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  return `${day}.${month}.${year}, ${weekday}`;
}

export default async function BookingViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    code?: string;
    name?: string;
    specialty?: string;
    date?: string;
    time?: string;
    address?: string;
    services?: string;
    price?: string;
    photo?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const hasData = sp.code && sp.name && sp.date && sp.time;

  if (!hasData) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center'>
        <svg width='56' height='56' viewBox='0 0 56 56' fill='none'>
          <circle cx='28' cy='28' r='28' fill='#F6F6F6' />
          <rect x='18' y='17' width='20' height='22' rx='3' fill='#C7C7C7' />
          <rect x='22' y='22' width='12' height='2' rx='1' fill='white' />
          <rect x='22' y='26' width='8' height='2' rx='1' fill='white' />
        </svg>
        <p className='mt-4 text-sm font-semibold text-[#333]'>Запись #{id} не найдена</p>
        <p className='mt-1 text-xs text-[#6B6B6B]'>Ссылка недействительна или устарела</p>
        <Link href='/' className='mt-5 bg-[#007BFF] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#0069D9] transition-colors'>
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F6F6F6] py-8 px-4'>
      <div className='max-w-lg mx-auto'>
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          {sp.photo && (
            <div className='w-full h-52 relative'>
              <Image
                src={sp.photo}
                alt={sp.name ?? ''}
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
              <div className='absolute bottom-0 left-0 p-4 text-white'>
                <p className='text-base font-semibold leading-tight'>{sp.name}</p>
                {sp.specialty && (
                  <p className='text-sm opacity-80 mt-0.5'>{sp.specialty}</p>
                )}
              </div>
            </div>
          )}

          <div className='p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='size-5 text-[#34C759]'>
                <svg viewBox='0 0 35 35' fill='none'>
                  <path d='M24.4637 12.1517C24.5852 12.2732 24.6817 12.4174 24.7475 12.5762C24.8133 12.7349 24.8472 12.9051 24.8472 13.0769C24.8472 13.2488 24.8133 13.4189 24.7475 13.5777C24.6817 13.7364 24.5852 13.8807 24.4637 14.0021L15.3098 23.156C15.1884 23.2775 15.0441 23.374 14.8854 23.4398C14.7266 23.5056 14.5565 23.5395 14.3846 23.5395C14.2128 23.5395 14.0426 23.5056 13.8839 23.4398C13.7251 23.374 13.5809 23.2775 13.4594 23.156L9.53635 19.2329C9.29097 18.9875 9.15312 18.6547 9.15312 18.3077C9.15312 17.9607 9.29097 17.6279 9.53635 17.3825C9.78173 17.1371 10.1145 16.9993 10.4615 16.9993C10.8086 16.9993 11.1414 17.1371 11.3867 17.3825L14.3846 20.382L22.6133 12.1517C22.7347 12.0301 22.8789 11.9337 23.0377 11.8679C23.1964 11.8021 23.3666 11.7682 23.5385 11.7682C23.7103 11.7682 23.8805 11.8021 24.0392 11.8679C24.198 11.9337 24.3422 12.0301 24.4637 12.1517Z' fill='#34C759' />
                </svg>
              </div>
              <span className='text-sm font-semibold text-[#34C759]'>Запись подтверждена</span>
              <span className='ml-auto text-xs text-[#6B6B6B] font-medium'>#{sp.code}</span>
            </div>

            <div className='flex gap-3 mb-4'>
              <div className='flex-1 bg-[#F6F6F6] rounded-xl p-3'>
                <div className='flex items-center gap-1.5 text-[#6B6B6B] mb-1'>
                  <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                    <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                    <line x1='16' y1='2' x2='16' y2='6'></line>
                    <line x1='8' y1='2' x2='8' y2='6'></line>
                    <line x1='3' y1='10' x2='21' y2='10'></line>
                  </svg>
                  <span className='text-xs'>Дата</span>
                </div>
                <p className='text-sm font-semibold text-[#333]'>{formatDate(sp.date!)}</p>
              </div>
              <div className='flex-1 bg-[#F6F6F6] rounded-xl p-3'>
                <div className='flex items-center gap-1.5 text-[#6B6B6B] mb-1'>
                  <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                    <circle cx='12' cy='12' r='10'></circle>
                    <polyline points='12 6 12 12 16 14'></polyline>
                  </svg>
                  <span className='text-xs'>Время</span>
                </div>
                <p className='text-sm font-semibold text-[#333]'>{sp.time}</p>
              </div>
            </div>

            {sp.services && (
              <div className='bg-[#F6F6F6] rounded-xl p-3 mb-3'>
                <p className='text-xs text-[#6B6B6B] mb-1'>Услуги</p>
                <p className='text-sm font-medium text-[#333]'>{sp.services}</p>
              </div>
            )}

            {sp.address && (
              <div className='flex items-start gap-2 bg-[#F6F6F6] rounded-xl p-3 mb-3'>
                <svg className='size-4 shrink-0 mt-0.5 text-[#6B6B6B]' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                  <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                  <circle cx='12' cy='10' r='3'></circle>
                </svg>
                <div>
                  <p className='text-xs text-[#6B6B6B] mb-0.5'>Адрес</p>
                  <p className='text-sm font-medium text-[#333]'>{sp.address}</p>
                </div>
              </div>
            )}

            {sp.price && sp.price !== '0' && (
              <div className='border-t border-[#E7E7EE] pt-3 mt-1 flex justify-between items-center'>
                <span className='text-sm text-[#6B6B6B]'>Итого</span>
                <span className='text-base font-semibold text-[#007BFF]'>
                  {Number(sp.price).toLocaleString('ru-RU')} сом
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
