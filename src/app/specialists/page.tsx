import { Suspense } from 'react';
import { DoctorsList } from '@/widgets';
import { PageTitle, SearchBar } from '@/shared/ui';
import { getSpecialists, getBranchSpecialists } from '@/shared/api';

const DoctorsListFallback = () => (
  <div className='flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 lg:mt-0 animate-pulse'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className='rounded-[10px] overflow-hidden bg-white border border-[#E7E7EE]'>
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

export default async function SpecialistsPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; branch?: string; specialty?: string; q?: string }>;
}) {
  const { org, branch, specialty, q } = await searchParams;

  const specialistsRes = branch
    ? await getBranchSpecialists(branch)
    : await getSpecialists();

  // specialty is now a slug — look up the numeric ID for the API filter
  const specialistId = specialty
    ? specialistsRes.data.find((s) => s.slug === specialty)?.id
    : undefined;

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <PageTitle title='Выберите специалиста, чтобы посмотреть свободные окна' />

      <div className='flex flex-col items-start mt-3 lg:flex-row lg:gap-7.5'>
        <div className='w-full lg:w-[33%]'>
          <SearchBar
            specialists={specialistsRes.data}
            org={org}
            branch={branch}
            initialQuery={q}
          />
        </div>
        <Suspense fallback={<DoctorsListFallback />}>
          <DoctorsList
            organizationId={org ? Number(org) : undefined}
            branchId={branch ? Number(branch) : undefined}
            specialistId={specialistId}
            search={q}
          />
        </Suspense>
      </div>
    </div>
  );
}
