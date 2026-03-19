'use client';

import { useRouter } from 'next/navigation';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';

interface PageTitleProps {
  title: string;
  href?: string;
}

export const PageTitle = ({ title, href }: PageTitleProps) => {
  const router = useRouter();

  const shortTitle = title.includes(',') ? title.split(',')[0] : title;

  const handleBack = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <div
      onClick={handleBack}
      className='flex gap-1.5 items-center md:mt-6 select-none max-w-100 cursor-pointer active:opacity-70 transition-opacity'
    >
      <ArrowIcon className='shrink-0 size-6' />

      <h2 className='text-base font-medium lg:hidden'>{shortTitle}</h2>
      <h2 className='text-sm font-medium hidden lg:inline'>{title}</h2>
    </div>
  );
};
