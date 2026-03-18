import Image from 'next/image';
import { DOCTORS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsName } from '@/shared/ui';

import StarIcon from '@/shared/assets/icons/doctor-detail/start-icon.svg';

export const DoctorsDetailsCard = ({ id }: { id: string }) => {
  const person = DOCTORS_LIST[+id - 1];

  return (
    <div className='flex items-stretch gap-3 bg-white md:p-5 mt-6 lg:mt-0 rounded-2xl md:max-w-max md:mx-auto'>
      <div className='w-[36%] h-40 shrink-0 overflow-hidden rounded-tl-[5px] rounded-bl-[5px] lg:rounded-[5px]'>
        <Image
          src={person.photo}
          alt={person.fullName}
          className='shrink-0 object-cover w-full h-full'
        />
      </div>
      <div className='font-medium text-xs md:text-base flex flex-col justify-between py-2.5 lg:py-0'>
        <div>
          <DoctorsName
            fullName='Сурапбеков Бекмамат Султангазиевич'
            className='md:text-[18px]'
          />
          <h2 className='text-gray mt-0.5'>{person.specialty}</h2>
        </div>
        <div>
          <div className='flex items-center mt-1.5 gap-2.5'>
            <div className='flex items-center gap-1'>
              <span className='font-semibold text-[#FEA500]'>4,8</span>
              <div className='flex'>
                <StarIcon className='size-3 md:size-4' />
              </div>
            </div>
            <svg
              width='2'
              height='2'
              viewBox='0 0 2 2'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='1' cy='1' r='1' fill='#312E2E' />
            </svg>
            <span className='font-light'>5 отзывов</span>
          </div>
          <h2 className='mt-0.5 font-medium'>Стаж 12 лет</h2>
        </div>
      </div>
    </div>
  );
};
