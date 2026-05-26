import Image from 'next/image';
import Link from 'next/link';
import logo from '@/shared/assets/images/logo.png';
import BellIcon from '@/shared/assets/icons/header/bell.svg';
import { BurgerMenu } from './BurgerMenu';

export const Header = () => {
  return (
    <header className='py-4 px-4 flex justify-between items-center md:bg-white'>
      <Link href={'/'}>
        <Image
          src={logo}
          alt='logo'
          width={94}
          height={30}
          className='shrink-0'
        />
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
