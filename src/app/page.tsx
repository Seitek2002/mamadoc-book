import { PageTitle } from '@/shared/ui';
import { SpecialistsList } from '@/widgets';

export default function Home() {
  return (
    <div>
      <PageTitle title='Выберите специалиста, чтобы посмотреть доступных врачей и время записи' />
      <SpecialistsList />
    </div>
  );
}
