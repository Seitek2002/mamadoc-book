import { DoctorsList } from '@/widgets';
import { PageTitle } from '@/shared/ui';
import { SearchBar } from '@/shared/ui/search-bar';

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);

  return (
    <div>
      <PageTitle title='Выберите врача, чтобы посмотреть свободные окна' />

      <div className='flex flex-col items-start mt-6 lg:flex-row lg:gap-7.5'>
        <SearchBar />
        <DoctorsList />
      </div>
    </div>
  );
};

export default page;
