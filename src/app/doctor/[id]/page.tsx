import { DoctorsDetailsCard } from '@/widgets';
import { PageTitle } from '@/shared/ui';
import { DoctorsSchedule } from '@/features';

const DoctorsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div>
      <div className='px-4'>
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <div className="flex flex-col">
        <DoctorsDetailsCard id={id} />
        <DoctorsSchedule id={id} />
      </div>
    </div>
  );
};

export default DoctorsPage;
