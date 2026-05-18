import { PageTitle } from '@/shared/ui';
import { BookingWrapper } from './BookingContainer';
import { getDoctorById, getDoctorCalendar } from '@/shared/api';

async function DoctorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [doctorRes, calendarRes] = await Promise.all([
    getDoctorById(id),
    getDoctorCalendar(id),
  ]);

  return (
    <div className='max-w-7xl mx-auto md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <BookingWrapper id={id} doctor={doctorRes.data} calendar={calendarRes.data} />
    </div>
  );
}

export default DoctorsPage;
