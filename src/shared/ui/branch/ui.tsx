import Link from 'next/link';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';
import type { ApiBranch } from '@/shared/mock';

export const Branch = ({ branch, orgSlug }: { branch: ApiBranch; orgSlug: string }) => {
  return (
    <Link
      href={`/?org=${orgSlug}&branch=${branch.slug}`}
      className='bg-white p-4 flex items-center gap-4 rounded-[10px] w-full overflow-hidden md:w-auto border border-[#E6EAF0] active:scale-95'
    >
      <div className='size-8 shrink-0 rounded-lg bg-[#F0F8FF] flex items-center justify-center'>
        <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M9 2C6.24 2 4 4.24 4 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Z' stroke='#4A9CF7' strokeWidth='1.4' strokeLinejoin='round' />
          <circle cx='9' cy='7' r='1.5' stroke='#4A9CF7' strokeWidth='1.4' />
        </svg>
      </div>
      <div className='flex-1 min-w-0'>
        <h2 className='text-sm md:text-base font-medium truncate'>{branch.address}</h2>
        <p className='text-xs text-[#6B6B6B] mt-0.5'>
          {branch.professionals_count} специалистов
        </p>
      </div>
      <ArrowIcon className='shrink-0 rotate-180 size-5' />
    </Link>
  );
};
