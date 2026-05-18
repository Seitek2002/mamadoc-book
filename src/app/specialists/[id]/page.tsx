import { DoctorsList } from '@/widgets';
import { PageTitle, SearchBar } from '@/shared/ui';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <PageTitle title='Выберите врача, чтобы посмотреть свободные окна' />

      <div className='flex flex-col items-start mt-3 lg:flex-row lg:gap-7.5'>
        <div className='w-full lg:w-[33%]'>
          <SearchBar />
        </div>
        <DoctorsList specialistId={Number(id)} />
      </div>
    </div>
  );
};

export default page;
