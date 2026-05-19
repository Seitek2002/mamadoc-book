import { getProfessionals } from '@/shared/api';
import { Doctors } from '@/shared/ui';

export const DoctorsList = async ({ specialistId }: { specialistId?: number }) => {
  const { data } = await getProfessionals({ specialist_id: specialistId });

  return (
    <div className='flex flex-col gap-4 my-4 lg:mt-0 md:grid md:grid-cols-2 lg:grid-cols-4 max-w-245.25 ml-auto'>
      {data.map((el) => (
        <Doctors key={el.id} el={el} />
      ))}
    </div>
  );
};
