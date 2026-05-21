import { getOrganizations } from '@/shared/api';
import { Organization } from '@/shared/ui';

export const OrganizationsList = async () => {
  const { data } = await getOrganizations();

  return (
    <div className='flex flex-col gap-2.5 my-6 md:grid md:grid-cols-2 lg:grid-cols-3 rounded-[20px] md:bg-white p-5'>
      {data.map((org) => (
        <Organization key={org.id} org={org} />
      ))}
    </div>
  );
};
