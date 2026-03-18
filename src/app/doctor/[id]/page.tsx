// import { DoctorsDetailsCard } from '@/widgets';
import { PageTitle } from '@/shared/ui';
// import { DoctorsSchedule, ServicesSelection } from '@/features';
import { BookingWrapper } from './BookingContainer';

async function DoctorsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className='max-w-7xl mx-auto md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <BookingWrapper id={id} />
    </div>
  );
}

export default DoctorsPage;
