import { redirect } from 'next/navigation';
import { getProfessionals, getBranchProfessionals } from '@/shared/api';
import { Doctors } from '@/shared/ui';

export const DoctorsList = async ({
  specialistId,
  organizationId,
  branchId,
  search,
}: {
  specialistId?: number;
  organizationId?: number;
  branchId?: number;
  search?: string;
}) => {
  const { data } = branchId
    ? await getBranchProfessionals(branchId, { specialist_id: specialistId, search })
    : await getProfessionals({
        specialist_id: specialistId,
        organization_id: organizationId,
        search,
      });

  if (data.length === 1) {
    redirect(`/specialist/${data[0].id}`);
  }

  if (data.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center py-16 text-center'>
        <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='24' cy='24' r='24' fill='#F6F6F6' />
          <path d='M24 14a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 14c6.627 0 12 2.686 12 6v2H12v-2c0-3.314 5.373-6 12-6Z' fill='#C7C7C7' />
        </svg>
        <p className='mt-4 text-sm font-medium text-dark'>Специалисты не найдены</p>
        <p className='mt-1 text-xs text-[#6B6B6B]'>Попробуйте выбрать другую специализацию</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 my-4 lg:mt-0 md:grid md:grid-cols-2 lg:grid-cols-4 max-w-245.25 ml-auto'>
      {data.map((el) => (
        <Doctors key={el.id} el={el} />
      ))}
    </div>
  );
};
