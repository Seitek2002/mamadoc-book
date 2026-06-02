'use client';

import Image from 'next/image';
import { useState } from 'react';
import { fixMediaUrl } from '@/shared/utils/media';

export const AvatarBlock = ({
  photo_url,
  full_name,
  specialty,
}: {
  photo_url: string;
  full_name: string;
  specialty: string;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className='w-32.25 relative lg:w-full lg:h-52.25 shrink-0 flex justify-center items-stretch'>
      {photo_url && !imgError ? (
        <Image
          src={fixMediaUrl(photo_url)}
          alt={full_name}
          width={400}
          height={400}
          loading='lazy'
          className='shrink-0 object-cover w-full h-full'
          onError={() => setImgError(true)}
        />
      ) : (
        <div className='w-full h-full bg-[#007BFF] flex items-center justify-center'>
          <span className='text-white text-4xl font-semibold leading-none'>
            {full_name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span className='absolute right-0 bottom-0 px-2 py-1.5 rounded-tl-[10px] hidden lg:inline text-xs font-semibold text-gray bg-white'>
        {specialty}
      </span>
    </div>
  );
};
