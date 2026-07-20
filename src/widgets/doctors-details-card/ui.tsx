'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ApiDoctorDetail, ApiReview } from '@/shared/mock';
import { fixMediaUrl } from '@/shared/utils/media';
import { DoctorsName } from '@/shared/ui';
import { ReviewsModal } from '@/features';

import StarIcon from '@/shared/assets/icons/doctor-detail/start-icon.svg';

const reviewWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'отзыв';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'отзыва';
  return 'отзывов';
};

const yearWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'год';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'года';
  return 'лет';
};

const BIO_CLAMP_LENGTH = 140;

interface DoctorsDetailsCardProps {
  doctor: ApiDoctorDetail;
  reviews: ApiReview[];
  reviewsTotal: number;
}

export const DoctorsDetailsCard = ({ doctor: person, reviews, reviewsTotal }: DoctorsDetailsCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const isBioLong = (person.bio?.length ?? 0) > BIO_CLAMP_LENGTH;

  return (
    <div className='bg-white p-4 md:p-5 lg:mt-0 rounded-2xl w-full shadow-sm'>
      <div className='flex items-start gap-4'>
        <div className='w-26 h-31 md:w-30 md:h-36 shrink-0 overflow-hidden rounded-xl'>
          {person.photo_url && !imgError ? (
            <Image
              src={fixMediaUrl(person.photo_url)}
              alt={person.full_name}
              width={400}
              height={400}
              priority
              className='shrink-0 object-cover w-full h-full'
              onError={() => setImgError(true)}
            />
          ) : (
            <div className='w-full h-full bg-[#007BFF] flex items-center justify-center'>
              <span className='text-white text-3xl font-semibold leading-none'>
                {person.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className='flex-1 min-w-0 py-0.5'>
          <DoctorsName
            fullName={person.full_name}
            className='text-base md:text-lg font-bold text-dark leading-snug'
          />

          <div className='flex items-center flex-wrap gap-1.5 mt-1.5'>
            {person.specialties.length > 0 && (
              <span className='inline-flex items-center text-[11px] font-semibold text-[#007BFF] bg-[#EAF3FF] rounded-full px-2.5 py-1'>
                {person.specialties[0]}
              </span>
            )}
            <button
              type='button'
              onClick={() => setIsReviewsOpen(true)}
              className='inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#007BFF] border border-[#DCEBFF] hover:bg-[#EAF3FF] rounded-full pl-2.5 pr-2 py-1 transition-colors'
            >
              Отзывы
              <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M9 6l6 6-6 6' />
              </svg>
            </button>
          </div>

          <div className='flex items-center gap-1.5 mt-2.5'>
            <StarIcon className='size-3.5 shrink-0' />
            <span className='text-sm font-bold text-[#FEA500] tabular-nums'>
              {person.rating}
            </span>
            <span className='text-xs text-[#98A2B3] font-medium'>
              · {reviewsTotal} {reviewWord(reviewsTotal)}
            </span>
          </div>

          <div className='flex items-center gap-1.5 mt-1.5 text-xs text-gray font-medium'>
            <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='#98A2B3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z' />
              <path d='M10 7V5h4v2' />
            </svg>
            Стаж {person.experience_years} {yearWord(person.experience_years)}
          </div>
        </div>
      </div>

      {person.bio && (
        <div className='border-t border-[#F0F1F4] mt-4 pt-3'>
          <p
            className={
              'text-xs text-gray leading-relaxed whitespace-pre-line' +
              (isBioLong && !isBioExpanded ? ' line-clamp-3' : '')
            }
          >
            {person.bio}
          </p>
          {isBioLong && (
            <button
              type='button'
              onClick={() => setIsBioExpanded((p) => !p)}
              className='text-xs font-semibold text-[#007BFF] hover:text-[#0069D9] mt-1.5 transition-colors'
            >
              {isBioExpanded ? 'Свернуть' : 'Читать далее'}
            </button>
          )}
        </div>
      )}

      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        reviews={reviews}
        total={reviewsTotal}
        rating={person.rating}
      />
    </div>
  );
};
