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
          <button
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#333] hover:bg-[#F6F6F6] transition-colors text-left w-full'
          >
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path
                d='M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm.75 11.5h-1.5v-5h1.5v5zm0-6.5h-1.5V5.5h1.5V7z'
                fill='#6B6B6B'
              />
              <path
                d='M6 10H4M16 10H14M10 4V2M10 18v-2'
                stroke='#6B6B6B'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
              <rect x='5' y='6' width='10' height='9' rx='1.5' stroke='#6B6B6B' strokeWidth='1.5' />
              <path d='M7.5 9.5h5M7.5 12h3' stroke='#6B6B6B' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
            История записей
          </button>
        </nav>
      </div>
    </>
  );
};
