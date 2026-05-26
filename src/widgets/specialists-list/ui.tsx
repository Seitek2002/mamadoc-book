import { getSpecialists } from '@/shared/api';
import { Specialists } from '@/shared/ui';

export const SpecialistsList = async () => {
  const { data } = await getSpecialists();

  return (
    <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
      {data.map((el) => (
        <Specialists key={el.id} id={el.id} title={el.title} img={el.icon_url} />
      ))}
    </div>
  );
};
