import { Suspense } from 'react';
import { DoctorsList } from '@/widgets';
import { PageTitle, SearchBar } from '@/shared/ui';
import { getSpecialists } from '@/shared/api';

const DoctorsListFallback = () => (
  <div className='flex flex-col gap-4 my-4 lg:mt-0 md:grid md:grid-cols-2 lg:grid-cols-4 max-w-245.25 ml-auto'>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className='rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE] animate-pulse'>
        <div className='w-full h-52 bg-gray-200' />
        <div className='p-2.5 flex flex-col gap-2'>
          <div className='h-4 bg-gray-200 rounded w-3/4' />
          <div className='h-3 bg-gray-200 rounded w-1/2' />
          <div className='h-7 bg-gray-200 rounded-full mt-2' />
        </div>
      </div>
    ))}
  </div>
);

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) => {
  const [{ id }, { q }, specialistsRes] = await Promise.all([
    params,
    searchParams,
    getSpecialists(),
  ]);

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <PageTitle title='Выберите специалиста, чтобы посмотреть свободные окна' />

      <div className='flex flex-col items-start mt-3 lg:flex-row lg:gap-7.5'>
        <div className='w-full lg:w-[33%]'>
          <SearchBar specialists={specialistsRes.data} initialQuery={q} />
        </div>
        <Suspense fallback={<DoctorsListFallback />}>
          <DoctorsList specialistId={Number(id)} search={q} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
