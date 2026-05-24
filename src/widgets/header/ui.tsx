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
        <div className='flex gap-1.5'>
          <Link href={'/login'}>Войти</Link>
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
