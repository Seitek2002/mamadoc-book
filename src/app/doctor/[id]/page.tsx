import { DoctorsDetailsCard } from '@/widgets';
import { PageTitle } from '@/shared/ui';
import { DoctorsSchedule, ServicesSelection } from '@/features';

async function DoctorsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className='max-w-7xl mx-auto p-4 md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[550px_1fr] gap-4 items-start'>
        <div className='lg:col-start-1 lg:row-start-1'>
          <DoctorsDetailsCard id={id} />
        </div>

        <div className='lg:col-start-2 lg:row-start-1 lg:row-span-2'>
          <DoctorsSchedule id={id} />
        </div>

        <div className='lg:col-start-1 lg:row-start-2'>
          <ServicesSelection />
        </div>
      </div>
    </div>
  );
}

export default DoctorsPage;
