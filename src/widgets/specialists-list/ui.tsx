import { SPECIALISTS_LIST } from '@/shared/assets/images/specialists';
import { Specialists } from '@/shared/ui';

export const SpecialistsList = () => {
  return (
    <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
      {SPECIALISTS_LIST.map((el) => (
        <Specialists key={el.id} {...el} />
      ))}
    </div>
  );
};
