import { DOCTORS_LIST } from '@/shared/assets/images/doctors';
import { Doctors } from '@/shared/ui';

export const DoctorsList = () => {
  return (
    <div className='flex flex-col gap-4 my-4 lg:mt-0 md:grid md:grid-cols-2 lg:grid-cols-4 max-w-245.25 ml-auto'>
      {DOCTORS_LIST.map((el) => (
        <Doctors key={el.id} el={el} />
      ))}
    </div>
  );
};
