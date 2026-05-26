import { PageTitle } from '@/shared/ui';
import { BookingWrapper } from './BookingContainer';
import { getProfessionals, getProfessionalById, getProfessionalCalendar, getPhoneCountries } from '@/shared/api';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { data } = await getProfessionals({ page: 1 });
    return data.map((d) => ({ id: String(d.id) }));
  } catch {
    return [];
  }
}

async function DoctorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [doctorRes, calendarRes, countries] = await Promise.all([
    getProfessionalById(id),
    getProfessionalCalendar(id),
    getPhoneCountries(),
  ]);

  return (
    <div className='max-w-7xl mx-auto md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <BookingWrapper id={id} doctor={doctorRes.data} calendar={calendarRes.data} countries={countries} />
    </div>
  );
}

export default DoctorsPage;
