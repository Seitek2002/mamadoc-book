'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ApiDoctorDetail } from '@/shared/mock';
import { fixMediaUrl } from '@/shared/utils/media';
import { DoctorsName } from '@/shared/ui';

import StarIcon from '@/shared/assets/icons/doctor-detail/start-icon.svg';

export const DoctorsDetailsCard = ({ doctor: person }: { doctor: ApiDoctorDetail }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className='flex items-stretch gap-3 bg-white md:p-5 mt-6 lg:mt-0 rounded-2xl md:mx-auto'>
      <div className='w-[36%] h-40 shrink-0 overflow-hidden rounded-tl-[5px] rounded-bl-[5px] lg:rounded-[5px]'>
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
      <div className='font-medium text-xs md:text-base flex flex-col justify-between py-2.5 lg:py-0'>
        <div>
          <DoctorsName
            fullName={person.full_name}
            className='md:text-[18px]'
          />
          <h2 className='text-gray mt-0.5'>{person.specialties[0]}</h2>
        </div>
        <div>
          <div className='flex items-center mt-1.5 gap-2.5'>
            <div className='flex items-center gap-1'>
              <span className='font-semibold text-[#FEA500]'>{person.rating}</span>
              <div className='flex'>
                <StarIcon className='size-3 md:size-4' />
              </div>
            </div>
            <svg
              width='2'
              height='2'
              viewBox='0 0 2 2'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='1' cy='1' r='1' fill='#312E2E' />
            </svg>
            <span className='font-normal'>{person.reviews.total_count} отзывов</span>
          </div>
          <h2 className='mt-0.5 font-medium'>Стаж {person.experience_years} лет</h2>
        </div>
      </div>
    </div>
  );
};
