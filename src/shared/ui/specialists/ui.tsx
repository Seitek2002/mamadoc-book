import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import ArrowIcon from '@/shared/assets/icons/arrow.svg';

export const Specialists = ({
  img,
  title,
  id,
}: {
  img: StaticImageData;
  title: string;
  id: number;
}) => {
  return (
    <Link
      href={'/specialists/' + id}
      title={'Подробнее'}
      className='bg-white p-4 flex items-center gap-4 rounded-[10px] w-full overflow-hidden md:w-auto border border-[#E6EAF0]'
    >
      <Image src={img} alt={title} width={32} height={32} />
      <h2 className='flex-1 text-sm md:text-base'>{title}</h2>
      <ArrowIcon className='shrink-0 rotate-180 size-5' />
    </Link>
  );
};
