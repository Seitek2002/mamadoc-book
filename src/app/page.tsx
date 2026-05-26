import { redirect } from 'next/navigation';
import { getOrganizationById, getOrganizationBranches, getBranchSpecialists } from '@/shared/api';
import { OrganizationsList } from '@/widgets';
import { PageTitle, Specialists, Branch } from '@/shared/ui';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; branch?: string }>;
}) {
  const { id, branch } = await searchParams;

  if (id && branch) {
    const [orgRes, specialistsRes] = await Promise.all([
      getOrganizationById(id),
      getBranchSpecialists(branch),
    ]);

    if (specialistsRes.data.length === 1) {
      redirect(`/specialists?org=${id}&branch=${branch}&specialty=${specialistsRes.data[0].id}`);
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
              href={`/specialists?org=${id}&branch=${branch}&specialty=${specialist.id}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (id) {
    const [orgRes, branchesRes] = await Promise.all([
      getOrganizationById(id),
      getOrganizationBranches(id),
    ]);

    if (branchesRes.data.length === 1) {
      redirect(`/?id=${id}&branch=${branchesRes.data[0].id}`);
    }

    return (
      <div className='px-4'>
        <PageTitle title={`${orgRes.data.name} — выберите филиал`} />
        <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
          {branchesRes.data.map((branchItem) => (
            <Branch key={branchItem.id} branch={branchItem} orgId={id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='px-4'>
      <PageTitle title='Выберите клинику, чтобы записаться к специалисту' />
      <OrganizationsList />
    </div>
  );
}
