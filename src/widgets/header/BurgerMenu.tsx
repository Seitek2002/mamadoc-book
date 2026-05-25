'use client';

import { useState } from 'react';
import BurgerMenuIcon from '@/shared/assets/icons/header/burger-menu.svg';

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='md:hidden flex items-center justify-center p-1'
        aria-label='Открыть меню'
      >
        <BurgerMenuIcon />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-[#E7E7EE]'>
          <span className='text-base font-semibold text-[#333]'>Меню</span>
          <button
            onClick={() => setIsOpen(false)}
            className='flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Закрыть меню'
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M12 4L4 12M4 4L12 12' stroke='#333' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <nav className='flex flex-col px-3 py-4 gap-1'>
          <a
            href='/bookings'
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#333] hover:bg-[#F6F6F6] transition-colors'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#6B6B6B' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='12' cy='12' r='10' />
              <polyline points='12 6 12 12 16 14' />
            </svg>
            История записей
          </a>
        </nav>
      </div>
    </>
  );
};
