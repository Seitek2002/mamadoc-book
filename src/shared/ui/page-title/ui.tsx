import Link from 'next/link';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';

interface PageTitleProps {
  title: string;
  href?: string;
}

export const PageTitle = ({ title, href = '/' }: PageTitleProps) => {
  const shortTitle = title.includes(',') ? title.split(',')[0] : title;

  return (
    <Link
      href={href}
      className='flex gap-1.5 items-center md:mt-6 select-none max-w-80'
    >
      <ArrowIcon className='shrink-0 lg:hidden' />

      <h2 className='text-base font-medium lg:hidden'>{shortTitle}</h2>
      <h2 className='text-sm font-medium hidden lg:inline'>{title}</h2>
    </Link>
  );
};
