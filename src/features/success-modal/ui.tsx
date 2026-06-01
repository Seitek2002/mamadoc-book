'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import type { BookingResult } from '@/shared/api';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingResult | null;
}

const AvatarCard = ({ booking }: { booking: BookingResult }) => {
  return (
    <>
      <div className='w-full h-40.25 relative lg:w-full lg:h-52.25 shrink-0 flex justify-center items-center'>
        <Image
          src={booking.professional.photo_url}
          alt={booking.professional.full_name}
          width={400}
          height={400}
          className='shrink-0 object-cover w-full h-full rounded-[10px] overflow-hidden'
          crossOrigin='anonymous'
        />
        <span className='absolute right-0 bottom-0 px-2 py-1.5 rounded-tl-[10px] inline text-xs font-semibold text-gray bg-white'>
          {booking.professional.specialty}
        </span>
      </div>
      <h2 className='font-medium text-sm text-dark'>
        {booking.professional.full_name}
      </h2>
    </>
  );
};

function QRBlock({ bookingUrl, code }: { bookingUrl: string; code: string }) {
  return (
    <>
      <div className='flex justify-center items-center p-2 bg-white border border-[#E7E7EE] rounded-xl'>
        {bookingUrl ? (
          <QRCodeSVG value={bookingUrl} size={136} level='M' />
        ) : (
          <div className='w-34.25 h-34.25 bg-gray-100 animate-pulse rounded' />
        )}
      </div>
      <div className='flex justify-center items-center font-medium text-sm mt-1.5'>
        {code}
      </div>
    </>
  );
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
  return `${day}.${month}.${year} (${weekday})`;
}

export function SuccessModal({ isOpen, onClose, booking }: SuccessModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [bookingUrl, setBookingUrl] = useState('');
  const [shareLabel, setShareLabel] = useState('Поделиться');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!booking) return;
    const params = new URLSearchParams({
      code: booking.confirmation_code,
      name: booking.professional.full_name,
      specialty: booking.professional.specialty,
      date: booking.date,
      time: booking.time,
      address: booking.professional.clinic_address,
      services: booking.services.map((s) => s.name).join(', '),
      price: String(booking.total_price),
      photo: booking.professional.photo_url,
    });
    if (booking.organization_id) params.set('org', String(booking.organization_id));
    if (booking.branch_id) params.set('branch', String(booking.branch_id));
    setBookingUrl(`${window.location.origin}/booking/${booking.id}?${params}`);
  }, [booking]);

  const handleShare = async () => {
    if (!bookingUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Моя запись к специалисту', url: bookingUrl });
      } else {
        await navigator.clipboard.writeText(bookingUrl);
        setShareLabel('Скопировано!');
        setTimeout(() => setShareLabel('Поделиться'), 2000);
      }
    } catch {
      // user cancelled
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !booking) return;
    setIsDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `booking-${booking.confirmation_code}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // silent
    } finally {
      setIsDownloading(false);
    }
  };

  if (!booking) return null;

  const shareIcon = (
    <svg width='15' height='15' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
      <circle cx='18' cy='5' r='3' /><circle cx='6' cy='12' r='3' /><circle cx='18' cy='19' r='3' />
      <line x1='8.59' y1='13.51' x2='15.42' y2='17.49' /><line x1='15.41' y1='6.51' x2='8.59' y2='10.49' />
    </svg>
  );

  const downloadIcon = (
    <svg width='15' height='15' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='7 10 12 15 17 10' /><line x1='12' y1='15' x2='12' y2='3' />
    </svg>
  );

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen
          ? 'opacity-100 pointer-events-auto bg-black/50'
          : 'opacity-0 pointer-events-none bg-black/0'
      }`}
    >
      <button
        onClick={onClose}
        className={`absolute top-3 right-4 lg:top-3 lg:right-4 p-1 transition-opacity duration-300 ${
          isOpen ? 'opacity-80 hover:opacity-100' : 'opacity-0'
        }`}
        aria-label='Закрыть'
      >
        <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M24.1008 22.7743C24.1879 22.8614 24.257 22.9648 24.3041 23.0786C24.3513 23.1924 24.3756 23.3143 24.3756 23.4375C24.3756 23.5607 24.3513 23.6827 24.3041 23.7965C24.257 23.9103 24.1879 24.0137 24.1008 24.1008C24.0137 24.1879 23.9103 24.257 23.7965 24.3041C23.6827 24.3513 23.5607 24.3756 23.4375 24.3756C23.3143 24.3756 23.1924 24.3513 23.0786 24.3041C22.9648 24.257 22.8614 24.1879 22.7743 24.1008L15 16.3254L7.22581 24.1008C7.0499 24.2767 6.81131 24.3756 6.56253 24.3756C6.31375 24.3756 6.07516 24.2767 5.89925 24.1008C5.72334 23.9249 5.62451 23.6863 5.62451 23.4375C5.62451 23.1888 5.72334 22.9502 5.89925 22.7743L13.6746 15L5.89925 7.22581C5.72334 7.0499 5.62451 6.81131 5.62451 6.56253C5.62451 6.31375 5.72334 6.07516 5.89925 5.89925C6.07516 5.72334 6.31375 5.62451 6.56253 5.62451C6.81131 5.62451 7.0499 5.72334 7.22581 5.89925L15 13.6746L22.7743 5.89925C22.9502 5.72334 23.1888 5.62451 23.4375 5.62451C23.6863 5.62451 23.9249 5.72334 24.1008 5.89925C24.2767 6.07516 24.3756 6.31375 24.3756 6.56253C24.3756 6.81131 24.2767 7.0499 24.1008 7.22581L16.3254 15L24.1008 22.7743Z'
            fill='white'
          />
        </svg>
      </button>
      <div
        ref={cardRef}
        className={`bg-white max-h-[90%] overflow-auto rounded-[10px] shadow-xl w-full max-w-78.75 lg:max-w-207 p-4 lg:p-10 relative flex transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className='flex flex-col items-center lg:items-start gap-4 lg:max-w-[70%] lg:pr-6'>
          <h2 className='text-green text-base lg:text-[22px] font-semibold flex items-center gap-2 pb-2 border-b border-gray lg:border-none'>
            <div className='size-6 lg:size-8.5'>
              <svg viewBox='0 0 35 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M24.4637 12.1517C24.5852 12.2732 24.6817 12.4174 24.7475 12.5762C24.8133 12.7349 24.8472 12.9051 24.8472 13.0769C24.8472 13.2488 24.8133 13.4189 24.7475 13.5777C24.6817 13.7364 24.5852 13.8807 24.4637 14.0021L15.3098 23.156C15.1884 23.2775 15.0441 23.374 14.8854 23.4398C14.7266 23.5056 14.5565 23.5395 14.3846 23.5395C14.2128 23.5395 14.0426 23.5056 13.8839 23.4398C13.7251 23.374 13.5809 23.2775 13.4594 23.156L9.53635 19.2329C9.29097 18.9875 9.15312 18.6547 9.15312 18.3077C9.15312 17.9607 9.29097 17.6279 9.53635 17.3825C9.78173 17.1371 10.1145 16.9993 10.4615 16.9993C10.8086 16.9993 11.1414 17.1371 11.3867 17.3825L14.3846 20.382L22.6133 12.1517C22.7347 12.0301 22.8789 11.9337 23.0377 11.8679C23.1964 11.8021 23.3666 11.7682 23.5385 11.7682C23.7103 11.7682 23.8805 11.8021 24.0392 11.8679C24.198 11.9337 24.3422 12.0301 24.4637 12.1517ZM34 17C34 20.3623 33.003 23.6491 31.135 26.4447C29.267 29.2403 26.612 31.4193 23.5056 32.7059C20.3993 33.9926 16.9811 34.3293 13.6835 33.6733C10.3858 33.0174 7.35668 31.3983 4.97919 29.0208C2.6017 26.6433 0.982607 23.6142 0.326658 20.3165C-0.329291 17.0189 0.00736583 13.6007 1.29406 10.4944C2.58074 7.38804 4.75968 4.733 7.55531 2.86502C10.3509 0.997032 13.6377 0 17 0C21.5072 0.0047597 25.8285 1.79735 29.0156 4.98444C32.2026 8.17153 33.9952 12.4928 34 17ZM31.3846 17C31.3846 14.155 30.541 11.3739 28.9604 9.00833C27.3798 6.6428 25.1332 4.79908 22.5048 3.71035C19.8763 2.62161 16.984 2.33675 14.1937 2.89178C11.4034 3.44681 8.84027 4.81682 6.82855 6.82854C4.81682 8.84026 3.44682 11.4034 2.89179 14.1937C2.33675 16.984 2.62162 19.8763 3.71036 22.5048C4.79909 25.1332 6.6428 27.3798 9.00834 28.9604C11.3739 30.541 14.155 31.3846 17 31.3846C20.8137 31.3803 24.47 29.8634 27.1667 27.1667C29.8634 24.47 31.3803 20.8137 31.3846 17Z'
                  fill='#34C759'
                />
              </svg>
            </div>
            Ваша запись подтверждена!
          </h2>
          <div className='lg:hidden'>
            <AvatarCard booking={booking} />
          </div>

          <div className='w-full border-t border-gray'>
            <div className='flex items-center gap-4 w-full lg:w-[70%] py-2 lg:py-4'>
              <div className='flex items-start gap-1.5 shrink-0 border-r border-gray pr-4'>
                <svg className='size-4 lg:size-6 shrink-0 mt-0.5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                  <circle cx='12' cy='12' r='10'></circle>
                  <polyline points='12 6 12 12 16 14'></polyline>
                </svg>
                <div>
                  <div className='leading-4 text-xs lg:text-sm'>Время</div>
                  <div className='text-base font-medium lg:text-[18px]'>{booking.time}</div>
                </div>
              </div>
              <div className='flex items-start gap-1.5 flex-1 min-w-0'>
                <svg className='size-4 lg:size-6 shrink-0 mt-0.5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                  <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                  <line x1='16' y1='2' x2='16' y2='6'></line>
                  <line x1='8' y1='2' x2='8' y2='6'></line>
                  <line x1='3' y1='10' x2='21' y2='10'></line>
                </svg>
                <div className='min-w-0'>
                  <div className='leading-4 text-xs lg:text-sm'>Дата</div>
                  <div className='text-base font-medium lg:text-[18px] wrap-break-word'>{formatDate(booking.date)}</div>
                </div>
              </div>
            </div>
            <div className='border-t border-gray'></div>
            <div className='flex flex-col w-full lg:w-[67%] py-2 lg:py-4 gap-2'>
              <div className='flex items-start gap-2'>
                <svg className='size-4 lg:size-6 shrink-0 mt-0.5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                  <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'></path>
                  <line x1='3' y1='6' x2='21' y2='6'></line>
                  <path d='M16 10a4 4 0 0 1-8 0'></path>
                </svg>
                <span className='text-xs lg:text-sm text-gray shrink-0 w-24 lg:w-28'>Услуга</span>
                <span className='text-sm font-medium lg:text-sm flex-1 min-w-0 wrap-break-word'>
                  {booking.services.map((s) => s.name).join(', ')}
                </span>
              </div>
              <div className='flex items-start gap-2'>
                <div className='size-4 lg:size-6 shrink-0' />
                <span className='text-xs lg:text-sm text-gray shrink-0 w-24 lg:w-28'>Специализация</span>
                <span className='text-sm font-medium lg:text-sm flex-1 min-w-0 wrap-break-word'>{booking.professional.specialty}</span>
              </div>
            </div>
            <div className='flex items-start gap-2 w-full border-t border-gray py-2 lg:py-4'>
              <svg className='size-4 lg:size-6 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
                <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                <circle cx='12' cy='10' r='3'></circle>
              </svg>
              <div>
                <div className='leading-4 text-xs mb-2 lg:text-sm'>Адрес</div>
                <div className='leading-4 text-xs font-medium lg:text-sm'>{booking.professional.clinic_address}</div>
              </div>
            </div>
          </div>

          <ul className='list-disc list-inside text-xs text-gray mt-4'>
            <li>
              Просим приходить вовремя, так как при опоздании время приёма может
              быть сокращено.
            </li>
            <li>
              Если вы не сможете прийти, сообщите об отмене заранее, не менее
              чем за 12 часов. При неявке без предупреждения возможность
              дальнейшей записи может быть ограничена.
            </li>
          </ul>

          <div className='lg:hidden w-full'>
            <QRBlock bookingUrl={bookingUrl} code={booking.confirmation_code} />
            <div className='flex gap-2 mt-3'>
              <button
                onClick={handleShare}
                className='flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#007BFF] border border-[#007BFF] rounded-full py-2 hover:bg-blue-50 transition-colors'
              >
                {shareIcon}
                {shareLabel}
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className='flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#333] border border-[#E7E7EE] rounded-full py-2 hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                {downloadIcon}
                {isDownloading ? 'Скачиваем...' : 'Скачать'}
              </button>
            </div>
          </div>
        </div>
        <div className='border-l border-gray pl-6 hidden lg:flex flex-col justify-center items-center gap-7.5'>
          <div className='hidden lg:block'>
            <AvatarCard booking={booking} />
          </div>
          <div className='hidden lg:block w-full'>
            <QRBlock bookingUrl={bookingUrl} code={booking.confirmation_code} />
            <div className='flex gap-2 mt-3'>
              <button
                onClick={handleShare}
                className='flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#007BFF] border border-[#007BFF] rounded-full py-2 hover:bg-blue-50 transition-colors'
              >
                {shareIcon}
                {shareLabel}
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className='flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#333] border border-[#E7E7EE] rounded-full py-2 hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                {downloadIcon}
                {isDownloading ? 'Скачиваем...' : 'Скачать'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
