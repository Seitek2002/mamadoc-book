'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import clsx from 'clsx';

export const AvatarBlock = ({
  photo,
  fullName,
  specialty,
}: {
  photo: StaticImageData;
  fullName: string;
  specialty: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='w-32.25 relative lg:w-full lg:h-52.25 shrink-0 flex justify-center items-stretch overflow-hidden bg-gray-100 rounded-lg'>
      {!isLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse z-10' />
      )}

      <Image
        src={photo}
        alt={fullName}
        className={clsx(
          'shrink-0 object-cover w-full h-full transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={() => setIsLoaded(true)}
      />

      <span className='absolute right-0 bottom-0 px-2 py-1.5 rounded-tl-[10px] hidden lg:inline text-xs font-semibold text-gray bg-white z-20'>
        {specialty}
      </span>
    </div>
  );
};
