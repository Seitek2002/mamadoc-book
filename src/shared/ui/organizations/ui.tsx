'use client';

import Link from 'next/link';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';
import type { ApiOrganizationPreview } from '@/shared/mock';

export const Organization = ({ org }: { org: ApiOrganizationPreview }) => {
  const handleClick = () => {
    localStorage.setItem('selected_org', JSON.stringify({ name: org.name, logo_url: org.logo_url ?? null }));
  };

  return (
    <Link
      href={'/?org=' + org.slug}
      onClick={handleClick}
      className='bg-white p-4 flex items-center gap-4 rounded-[10px] w-full overflow-hidden md:w-auto border border-[#E6EAF0] active:scale-95'
    >
      <div className='size-8 shrink-0 rounded-lg bg-[#F0F4FF] flex items-center justify-center'>
        <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M2 16V5l7-3 7 3v11H2Z' stroke='#4A6CF7' strokeWidth='1.4' strokeLinejoin='round' />
          <path d='M6 16v-4h6v4' stroke='#4A6CF7' strokeWidth='1.4' strokeLinejoin='round' />
          <rect x='6' y='7' width='2' height='2' rx='0.5' fill='#4A6CF7' />
          <rect x='10' y='7' width='2' height='2' rx='0.5' fill='#4A6CF7' />
        </svg>
      </div>
      <div className='flex-1 min-w-0'>
        <h2 className='text-sm md:text-base font-medium truncate'>{org.name}</h2>
        <p className='text-xs text-[#6B6B6B] mt-0.5'>
          {org.professionals_count} специалистов · {org.specialists_count} направлений
        </p>
      </div>
      <ArrowIcon className='shrink-0 rotate-180 size-5' />
    </Link>
  );
};
