import Link from 'next/link';
import { ApiDoctorPreview } from '@/shared/mock';
import { AvailabilityBlock } from './availability';
import { AvatarBlock } from './avatar-block';

export const Doctors = ({ el }: { el: ApiDoctorPreview }) => {
  return (
    <Link
      href={'/specialist/' + el.id}
      className='flex lg:flex-col lg:max-w-57.5 rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE] active:scale-95'
    >
      <AvatarBlock photo_url={el.photo_url} full_name={el.full_name} specialty={el.specialty} />
      <div className='p-2.5 flex flex-col flex-1'>
        <div>
          <h2 className='text-sm font-medium line-clamp-2'>{el.full_name}</h2>
          <span className='lg:hidden text-xs font-semibold text-gray'>
            {el.specialty}
          </span>
        </div>
        <div className='mt-auto overflow-hidden'>
          <AvailabilityBlock availability={el.availability} />
          <button className='text-xs active:bg-dark active:text-white border cursor-pointer w-full rounded-full py-1.5 border-[#C7C7C7]'>
            Записаться
          </button>
        </div>
      </div>
    </Link>
  );
};
