'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/shared/assets/images/logo.png';
import { fixMediaUrl } from '@/shared/utils/media';
import BellIcon from '@/shared/assets/icons/header/bell.svg';
import { BurgerMenu } from './BurgerMenu';

interface SavedOrg {
  name: string;
  logo_url: string | null;
}

function OrgLogoPlaceholder({ name }: { name: string }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='size-8 shrink-0 rounded-lg bg-[#F0F4FF] flex items-center justify-center'>
        <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M2 16V5l7-3 7 3v11H2Z' stroke='#4A6CF7' strokeWidth='1.4' strokeLinejoin='round' />
          <path d='M6 16v-4h6v4' stroke='#4A6CF7' strokeWidth='1.4' strokeLinejoin='round' />
          <rect x='6' y='7' width='2' height='2' rx='0.5' fill='#4A6CF7' />
          <rect x='10' y='7' width='2' height='2' rx='0.5' fill='#4A6CF7' />
        </svg>
      </div>
      <span className='text-sm font-semibold text-[#333] max-w-36 truncate'>{name}</span>
    </div>
  );
}

export const Header = () => {
  const [org, setOrg] = useState<SavedOrg | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('selected_org');
    if (raw) {
      try { setOrg(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  return (
    <header className='py-4 px-4 flex justify-between items-center md:bg-white'>
      <Link href={'/'}>
        {org ? (
          org.logo_url ? (
            <Image
              src={fixMediaUrl(org.logo_url)}
              alt={org.name}
              width={94}
              height={30}
              className='h-8 w-auto object-contain shrink-0'
              unoptimized
            />
          ) : (
            <OrgLogoPlaceholder name={org.name} />
          )
        ) : (
          <Image
            src={logo}
            alt='logo'
            width={94}
            height={30}
            className='shrink-0'
          />
        )}
      </Link>

      <BurgerMenu />

      <div className='hidden md:flex gap-4 text-sm items-center'>
        <Link
          href='/bookings'
          className='flex items-center gap-1.5 text-[#333] hover:text-[#007BFF] transition-colors font-medium'
        >
          <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' viewBox='0 0 24 24'>
            <circle cx='12' cy='12' r='10' />
            <polyline points='12 6 12 12 16 14' />
          </svg>
          История записей
        </Link>
        <BellIcon />
        <div className='w-10 h-10 rounded-full bg-[#F0F4FF] border border-[#D0DCFF] flex items-center justify-center shrink-0'>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='8' r='4' fill='#7FA8FF' />
            <path d='M4 20c0-4 3.582-7 8-7s8 3 8 7' stroke='#7FA8FF' strokeWidth='2' strokeLinecap='round' />
          </svg>
        </div>
      </div>
    </header>
  );
};
