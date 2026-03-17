import { DOCTORS_DETAILS_LIST } from '@/shared/assets/images/doctors';
import { DoctorsScheduleItem } from '@/shared/ui';

export const DoctorsSchedule = () => {
  const example = DOCTORS_DETAILS_LIST[1].availabilityCalendar;

  return (
    <div className='bg-white rounded-2xlpy-5 my-4'>
      <div className='grid grid-cols-4 gap-2 max-h-41.25 overflow-auto px-4 py-5'>
        {example.map((el) => (
          <DoctorsScheduleItem key={el.date} data={el} />
        ))}
      </div>
      <div className='p-4 flex flex-wrap gap-3'>
        {example[0].times.map((el) => (
          <div
            key={el}
            className='w-18.75 h-6.5 flex justify-center items-center rounded-full bg-[#736767]'
          >
            <span className='text-white text-xs font-semibold'>{el}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
