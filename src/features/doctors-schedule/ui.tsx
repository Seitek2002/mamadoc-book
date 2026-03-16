import { DOCTORS_DETAILS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsScheduleItem } from '@/shared/ui';

export const DoctorsSchedule = () => {
  const example = DOCTORS_DETAILS_LIST[1].availabilityCalendar;

  return (
    <div className='bg-white rounded-2xl px-4 py-5 my-4 grid grid-cols-4 gap-2 max-h-41.25 overflow-auto'>
      {example.map((el) => (
        <DoctorsScheduleItem key={el.date} data={el} />
      ))}
    </div>
  );
};
