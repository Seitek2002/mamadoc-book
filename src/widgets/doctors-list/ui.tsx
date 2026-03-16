import { DOCTORS_LIST } from '@/shared/assets/images/doctors';
import { Doctors } from '@/shared/ui';

export const DoctorsList = () => {
  return (
    <div className='flex flex-col gap-4 my-6'>
      {DOCTORS_LIST.map((el) => (
        <Doctors key={el.id} el={el} />
      ))}
    </div>
  );
};
