import { DoctorsDetailsCard } from '@/widgets';
import { PageTitle } from '@/shared/ui';

const DoctorsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);

  return (
    <div>
      <div className="px-4">
        <PageTitle title='Выберите дату и время, чтобы записаться' />
      </div>
      <DoctorsDetailsCard />
    </div>
  );
};

export default DoctorsPage;
