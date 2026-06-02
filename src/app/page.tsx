import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getOrganizationById, getOrganizationBranches, getBranchSpecialists } from '@/shared/api';
import { OrganizationsList, DoctorsList } from '@/widgets';
import { PageTitle, Branch, SearchBar } from '@/shared/ui';
import { OrgCleaner } from '@/shared/ui/organizations/OrgCleaner';

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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; branch?: string; q?: string }>;
}) {
  const { org, branch, q } = await searchParams;

  // org + branch: показываем всех докторов филиала
  if (org && branch) {
    const [orgRes, specialistsRes] = await Promise.all([
      getOrganizationById(org),
      getBranchSpecialists(branch),
    ]);

    return (
      <div className='max-w-7xl mx-auto px-4'>
        <PageTitle title={orgRes.data.name} />
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
              organizationSlug={org}
              branchSlug={branch}
              search={q}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // только org: показываем выбор филиала
  if (org) {
    const [orgRes, branchesRes] = await Promise.all([
      getOrganizationById(org),
      getOrganizationBranches(org),
    ]);

    if (branchesRes.data.length === 1) {
      redirect(`/?org=${org}&branch=${branchesRes.data[0].slug}`);
    }

    return (
      <div className='px-4'>
        <PageTitle title={`${orgRes.data.name} — выберите филиал`} />
        <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
          {branchesRes.data.map((branchItem) => (
            <Branch key={branchItem.id} branch={branchItem} orgSlug={org} />
          ))}
        </div>
      </div>
    );
  }

  // главная: список организаций
  return (
    <div className='px-4'>
      <OrgCleaner />
      <PageTitle title='Выберите организацию, чтобы записаться к специалисту' />
      <OrganizationsList />
    </div>
  );
}
