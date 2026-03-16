import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import BurgerMenuIcon from '@/assets/icons/header/burger-menu.svg';
import BellIcon from '@/assets/icons/header/bell.svg';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className='py-4 px-4 flex justify-between items-center bg-white'>
      <Image
        src={logo}
        alt='logo'
        width={94}
        height={30}
        className='shrink-0'
      />

      <BurgerMenuIcon className='md:hidden' />
      <div className='hidden md:flex gap-4 text-sm items-center'>
        <div className='flex gap-1.5'>
          <Link href={'/login'}>Войти</Link>/
          <Link href={'/register'}>Регистрация</Link>
        </div>
        <BellIcon />
        <Image
          src={'/avatar.png'}
          alt='avatar'
          width={40}
          height={40}
          className='rounded-full'
        />
      </div>
    </header>
  );
};
