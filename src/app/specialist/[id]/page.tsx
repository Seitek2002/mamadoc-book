import { PageTitle } from '@/shared/ui';
import { BookingWrapper } from './BookingContainer';
import { getProfessionals, getProfessionalById, getProfessionalCalendar, getPhoneCountries, getProfessionalReviews } from '@/shared/api';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { data } = await getProfessionals({ page: 1 });
    return data.filter((d) => d.slug).map((d) => ({ id: d.slug }));
  } catch {
    return [];
  }
}

async function DoctorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [doctorRes, calendarRes, countries, reviewsRes] = await Promise.all([
    getProfessionalById(id),
    getProfessionalCalendar(id),
    getPhoneCountries(),
    getProfessionalReviews(id),
  ]);

  return (
    <div className='md:pt-0'>
      <div className='px-0 lg:px-4 mb-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <BookingWrapper
        id={id}
        doctor={doctorRes.data}
        calendar={calendarRes.data}
        countries={countries}
        reviews={reviewsRes.data}
        reviewsTotal={reviewsRes.pagination.total}
      />
    </div>
  );
}

export default DoctorsPage;
