import Image from 'next/image';
import Link from 'next/link';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';

export const Specialists = ({
  img,
  title,
  id,
  href,
}: {
  img: string;
  title: string;
  id: number;
  href?: string;
}) => {
  return (
    <Link
      href={href ?? '/specialists/' + id}
      title={'Подробнее'}
      className='bg-white p-4 flex items-center gap-4 rounded-[10px] w-full overflow-hidden md:w-auto border border-[#E6EAF0] active:scale-95'
    >
      {img ? (
        <Image src={img} alt={title} width={32} height={32} />
      ) : (
        <span className='size-8 shrink-0 rounded-lg bg-[#F0F4FF] flex items-center justify-center text-xs font-semibold text-[#4A6CF7]'>
          {title.charAt(0)}
        </span>
      )}
      <h2 className='flex-1 text-sm md:text-base'>{title}</h2>
      <ArrowIcon className='shrink-0 rotate-180 size-5' />
    </Link>
  );
};
