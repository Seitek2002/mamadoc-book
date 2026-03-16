import { PageTitle } from '@/shared/ui';

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);

  return (
    <div>
      <PageTitle title='Выберите врача, чтобы посмотреть свободные окна' />
    </div>
  );
};

export default page;
