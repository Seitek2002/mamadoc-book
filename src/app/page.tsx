import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getOrganizationById, getOrganizationBranches, getBranchSpecialists } from '@/shared/api';
import { OrganizationsList, DoctorsList } from '@/widgets';
import { PageTitle, Branch, SearchBar, Specialists } from '@/shared/ui';
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
  searchParams: Promise<{ org?: string; branch?: string; specialty?: string; q?: string }>;
}) {
  const { org, branch, specialty, q } = await searchParams;

  // org + branch: основной экран выбора специалиста
  if (org && branch) {
    const [orgRes, specialistsRes] = await Promise.all([
      getOrganizationById(org),
      getBranchSpecialists(branch),
    ]);

    const specialistId = specialty
      ? specialistsRes.data.find((s) => s.slug === specialty)?.id
      : undefined;

    const buildSpecialtyHref = (slug: string) =>
      `/?org=${org}&branch=${branch}&specialty=${slug}`;

    return (
      <div className='px-4'>

        {/* ── MOBILE: шаг 1 — список специализаций ── */}
        {!specialty && (
          <div className='lg:hidden'>
            <PageTitle title='Выберите специалиста' />
            <div className='flex flex-col gap-2.5 mt-3'>
              {specialistsRes.data.map((s) => (
                <Specialists
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  img={s.icon_url}
                  href={buildSpecialtyHref(s.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── MOBILE: шаг 2 — список докторов ── */}
        {specialty && (
          <div className='lg:hidden'>
            <PageTitle title='Выберите врача' />
            <div className='mt-3'>
              <SearchBar
                specialists={specialistsRes.data}
                org={org}
                branch={branch}
                specialty={specialty}
                initialQuery={q}
              />
            </div>
            <Suspense fallback={<DoctorsListFallback />}>
              <DoctorsList
                organizationSlug={org}
                branchSlug={branch}
                specialistId={specialistId}
                search={q}
              />
            </Suspense>
          </div>
        )}

        {/* ── DESKTOP: всё сразу ── */}
        <div className='hidden lg:block'>
          <PageTitle title={orgRes.data.name} />
          <div className='flex items-start mt-3 gap-7.5'>
            <div className='w-[33%]'>
              <SearchBar
                specialists={specialistsRes.data}
                org={org}
                branch={branch}
                specialty={specialty}
                initialQuery={q}
              />
            </div>
            <Suspense fallback={<DoctorsListFallback />}>
              <DoctorsList
                organizationSlug={org}
                branchSlug={branch}
                specialistId={specialistId}
                search={q}
              />
            </Suspense>
          </div>
        </div>

      </div>
    );
  }

  // только org: выбор филиала
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
