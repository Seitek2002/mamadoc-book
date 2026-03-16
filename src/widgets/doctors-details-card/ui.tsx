import Image from 'next/image';
import { DOCTORS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsName } from '@/shared/ui';

import StarIcon from '@/shared/assets/icons/doctor-detail/start-icon.svg';

export const DoctorsDetailsCard = () => {
  const person = DOCTORS_LIST[0];

  return (
    <div className='flex flex-col items-center gap-3 bg-white px-2.5 py-5 mt-6 rounded-2xl'>
      <div className='w-31 h-24 shrink-0 overflow-hidden rounded-[5px]'>
        <Image
          src={person.photo}
          alt={person.fullName}
          className='shrink-0 object-cover w-full h-full'
        />
      </div>
      <div className='text-center font-medium text-xs'>
        <DoctorsName fullName='Сурапбеков Бекмамат Султангазиевич' />
        <h2 className='text-gray mt-0.5'>{person.specialty}</h2>
        <div className='flex items-center justify-center mt-1.5 gap-2.5 text-[#FEA500]'>
          <span className='font-semibold'>4,8</span>
          <div className='flex'>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </div>
        </div>
        <h2 className='mt-0.5 font-semibold'>Стаж 12 лет</h2>
      </div>
    </div>
  );
};
