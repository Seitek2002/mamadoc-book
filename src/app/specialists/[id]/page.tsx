import { DoctorsList } from '@/widgets';
import { PageTitle, SearchBar } from '@/shared/ui';

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);

  return (
    <div className='px-4'>
      <PageTitle title='Выберите врача, чтобы посмотреть свободные окна' />

      <div className='flex flex-col items-start mt-6 lg:flex-row lg:gap-7.5'>
        <SearchBar />
        <DoctorsList />
      </div>
    </div>
  );
};

export default page;
