'use client';

import Image from 'next/image';
import type { ApiReview } from '@/shared/mock';
import { fixMediaUrl } from '@/shared/utils/media';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ApiReview[];
  total: number;
  rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width='14' height='14' viewBox='0 0 24 24' fill={i < rating ? '#FEA500' : '#E7E7EE'}>
          <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const toDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  if (toDay(date) === toDay(now)) return `Сегодня, ${hhmm}`;
  if (toDay(date) === toDay(now) - 86400000) return `Вчера, ${hhmm}`;

  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${hhmm}`;
}

function ReviewCard({ review }: { review: ApiReview }) {
  const avatarUrl = fixMediaUrl(review.client_avatar);
  return (
    <div className='border border-[#EEF0F3] rounded-xl p-4'>
      <div className='flex items-center gap-3 mb-2'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={review.patient_name}
            width={40}
            height={40}
            className='size-10 rounded-full object-cover shrink-0'
          />
        ) : (
          <div className='size-10 rounded-full bg-[#007BFF] flex items-center justify-center text-sm font-semibold text-white shrink-0'>
            {review.patient_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-dark leading-tight truncate'>{review.patient_name}</p>
          <p className='text-xs text-[#98A2B3] mt-0.5'>{formatDate(review.date)}</p>
        </div>
        <div className='ml-auto shrink-0'>
          <StarRating rating={review.rating} />
        </div>
      </div>
      {review.text && (
        <p className='text-[13px] text-[#4B4B4B] mt-2 leading-relaxed whitespace-pre-line'>{review.text}</p>
      )}
    </div>
  );
}

export function ReviewsModal({ isOpen, onClose, reviews, total, rating }: ReviewsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen
          ? 'opacity-100 pointer-events-auto bg-black/50'
          : 'opacity-0 pointer-events-none bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-lg max-h-[85vh] md:max-h-[80vh] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-100 translate-y-8 md:scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F0F1F4] shrink-0'>
          <div>
            <h2 className='text-base font-semibold text-dark'>Отзывы</h2>
            {total > 0 && (
              <div className='flex items-center gap-1.5 mt-1'>
                <StarRating rating={Math.round(rating)} />
                <span className='text-xs text-[#98A2B3] font-medium'>
                  {rating.toFixed(1)} · {total}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-dark transition-colors p-1 -mr-1'
            aria-label='Закрыть'
          >
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        </div>

        <div className='overflow-y-auto custom-scrollbar px-5 py-4 flex flex-col gap-3'>
          {reviews.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 gap-3 text-[#98A2B3]'>
              <svg width='48' height='48' viewBox='0 0 56 56' fill='none'>
                <rect x='6' y='10' width='44' height='30' rx='8' stroke='#D9DCE1' strokeWidth='2' fill='#FAFAFB' />
                <circle cx='20' cy='25' r='2.5' fill='#C6CAD2' />
                <circle cx='28' cy='25' r='2.5' fill='#C6CAD2' />
                <circle cx='36' cy='25' r='2.5' fill='#C6CAD2' />
                <path d='M20 40 L28 48 L28 40' fill='#FAFAFB' stroke='#D9DCE1' strokeWidth='2' strokeLinejoin='round' />
              </svg>
              <p className='text-sm'>Отзывов пока нет</p>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {total > reviews.length && (
                <p className='text-xs text-[#98A2B3] text-center pt-1 pb-1'>
                  Показано {reviews.length} из {total}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
