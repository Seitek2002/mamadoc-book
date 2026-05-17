import { MOCK_DOCTORS_LIST } from '@/shared/mock';
import { Doctors } from '@/shared/ui';

export const DoctorsList = () => {
  return (
    <div className='flex flex-col gap-4 my-4 lg:mt-0 md:grid md:grid-cols-2 lg:grid-cols-4 max-w-245.25 ml-auto'>
      {MOCK_DOCTORS_LIST.data.map((el) => (
        <Doctors key={el.id} el={el} />
      ))}
    </div>
  );
};
