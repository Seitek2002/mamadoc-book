import { MOCK_SPECIALISTS } from '@/shared/mock';
import { Specialists } from '@/shared/ui';

export const SpecialistsList = () => {
  return (
    <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
      {MOCK_SPECIALISTS.data.map((el) => (
        <Specialists key={el.id} id={el.id} title={el.title} img={el.icon_url} />
      ))}
    </div>
  );
};
