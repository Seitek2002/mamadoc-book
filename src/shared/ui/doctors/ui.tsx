import Link from 'next/link';
import { DoctorPreview } from '@/shared/assets/images/doctors';
import { AvailabilityBlock } from './availability';
import { AvatarBlock } from './avatar-block';

export const Doctors = ({ el }: { el: DoctorPreview }) => {
  return (
    <Link
      href={'/doctor/' + el.id}
      className='flex lg:flex-col lg:w-57.5 rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE]'
    >
      <AvatarBlock {...el} />
      <div className='p-2.5 flex flex-col flex-1'>
        <div>
          <h2 className='text-sm font-medium line-clamp-2'>{el.fullName}</h2>
          <span className='lg:hidden text-xs font-semibold text-gray'>
            {el.specialty}
          </span>
        </div>
        <div className='mt-auto'>
          <AvailabilityBlock availability={el.availability} />
          <button className='text-xs border cursor-pointer w-full rounded-full py-1.5 border-[#C7C7C7]'>
            Записаться
          </button>
        </div>
      </div>
    </Link>
  );
};
