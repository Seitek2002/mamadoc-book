import { redirect } from 'next/navigation';
import { getOrganizationById, getOrganizationBranches, getBranchSpecialists } from '@/shared/api';
import { OrganizationsList } from '@/widgets';
import { PageTitle, Specialists, Branch } from '@/shared/ui';
import { OrgCleaner } from '@/shared/ui/organizations/OrgCleaner';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ org?: string; branch?: string }>;
}) {
  const { org, branch } = await searchParams;

  if (org && branch) {
    const [orgRes, specialistsRes] = await Promise.all([
      getOrganizationById(org),
      getBranchSpecialists(branch),
    ]);

    if (specialistsRes.data.length === 1) {
      redirect(`/specialists?org=${org}&branch=${branch}&specialty=${specialistsRes.data[0].slug}`);
    }

    return (
      <div className='px-4'>
        <PageTitle title={`${orgRes.data.name} — выберите специализацию`} />
        <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
          {specialistsRes.data.map((specialist) => (
            <Specialists
              key={specialist.id}
              id={specialist.id}
              title={specialist.title}
              img={specialist.icon_url}
              href={`/specialists?org=${org}&branch=${branch}&specialty=${specialist.slug}`}
            />
          ))}
        </div>
      </div>
    );
  }

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

  return (
    <div className='px-4'>
      <OrgCleaner />
      <PageTitle title='Выберите организацию, чтобы записаться к специалисту' />
      <OrganizationsList />
    </div>
  );
}
