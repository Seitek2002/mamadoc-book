import { DoctorsList } from '@/widgets';
import { PageTitle } from '@/shared/ui';
import { SearchBar } from '@/shared/ui/search-bar';

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);

  return (
    <div>
      <PageTitle title='Выберите врача, чтобы посмотреть свободные окна' />

      <div className='flex fles-col'>
        <SearchBar />
        <DoctorsList />
      </div>
    </div>
  );
};

export default page;
