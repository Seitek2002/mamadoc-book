import Image from 'next/image';
import type { ApiReview } from '@/shared/mock';
import { fixMediaUrl } from '@/shared/utils/media';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width='16' height='16' viewBox='0 0 24 24' fill={i < rating ? '#FEA500' : '#E0E0E0'}>
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

  if (toDay(date) === toDay(now)) return `Сегодня ${hhmm}`;
  if (toDay(date) === toDay(now) - 86400000) return `Вчера ${hhmm}`;

  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  return `${date.getDate()} ${months[date.getMonth()]} ${hhmm}`;
}

function ReviewCard({ review }: { review: ApiReview }) {
  const avatarUrl = fixMediaUrl(review.client_avatar);
  return (
    <div className='border border-[#E7E7EE] rounded-xl p-4'>
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
        <div>
          <p className='text-sm font-medium leading-tight'>{review.patient_name}</p>
          <p className='text-xs text-[#9E9E9E] mt-0.5'>{formatDate(review.date)}</p>
        </div>
      </div>
      <StarRating rating={review.rating} />
      {review.text && (
        <p className='text-sm text-[#333] mt-2 leading-relaxed'>{review.text}</p>
      )}
    </div>
  );
}

export function ReviewsBlock({ reviews, total }: { reviews: ApiReview[]; total: number }) {
  return (
    <div className='bg-white rounded-2xl p-4 lg:p-5 mt-4 lg:mt-0'>
      <h2 className='text-base font-semibold mb-4'>Отзывы</h2>

      {reviews.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 gap-3 text-[#9E9E9E]'>
          <svg width='56' height='56' viewBox='0 0 56 56' fill='none'>
            <rect x='6' y='10' width='44' height='30' rx='8' stroke='#D0D0D0' strokeWidth='2' fill='none' />
            <rect x='6' y='10' width='44' height='30' rx='8' fill='#F6F6F6' />
            <circle cx='20' cy='25' r='2.5' fill='#C0C0C0' />
            <circle cx='28' cy='25' r='2.5' fill='#C0C0C0' />
            <circle cx='36' cy='25' r='2.5' fill='#C0C0C0' />
            <path d='M20 40 L28 48 L28 40' fill='#F6F6F6' stroke='#D0D0D0' strokeWidth='2' strokeLinejoin='round' />
          </svg>
          <p className='text-sm'>Отзывов пока нет</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {total > reviews.length && (
            <p className='text-xs text-[#9E9E9E] text-center pt-1'>
              Показано {reviews.length} из {total}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
