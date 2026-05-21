import { getOrganizationById, getSpecialists } from '@/shared/api';
import { OrganizationsList } from '@/widgets';
import { PageTitle, Specialists } from '@/shared/ui';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (id) {
    const [orgRes, specialistsRes] = await Promise.all([
      getOrganizationById(id),
      getSpecialists(),
    ]);

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
              href={`/specialists?org=${id}&specialty=${specialist.id}`}
            />
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
