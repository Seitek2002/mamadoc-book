import { Availability } from '@/shared/assets/images/doctors';
import clsx from 'clsx';

export const AvailabilityBlock = ({
  availability,
}: {
  availability: Availability;
}) => {
  const isToday = availability.label === 'Сегодня';
  const isTomorrow = availability.label === 'Завтра';
  const isSpecial = isToday || isTomorrow;

  const titleColor = isToday
    ? 'text-[#34C759]'
    : isTomorrow
      ? 'text-[#0088FF]'
      : 'text-[#7A7878]';

  const slotBg = isToday
    ? 'bg-[#D7FFE3]'
    : isTomorrow
      ? 'bg-[#C4DCFF]'
      : 'bg-[#EFEDED]';

  const slotText = isToday
    ? 'text-[#008236]'
    : isTomorrow
      ? 'text-[#0088FF]'
      : 'text-[#665F5F]';

  // ── Стили именно для метки дня (Сегодня / Завтра / 13 марта)
  const dayLabelClasses = clsx(
    'lowercase lg:normal-case lg:text-[10px]',
    !isSpecial &&
      'lg:border lg:border-gray lg:font-semibold lg:rounded-full lg:px-1.5 lg:py-0.5',
  );

  return (
    <div className='mb-1.5 lg:flex lg:items-center'>
      <span className={clsx('text-xs font-medium block shrink-0', titleColor)}>
        <span className='lg:hidden'>Свободные окна </span>
        <span className={dayLabelClasses}>{availability.label}:</span>
      </span>

      <div className='flex gap-1 items-center flex-1 mt-1 lg:mt-0'>
        <div className='flex gap-1 items-center lg:max-w-30 overflow-x-hidden flex-1'>
          {availability.slots.map((item, i) => (
            <span
              key={i}
              className={clsx(
                'text-xs font-medium rounded-full px-2 py-0.5 lg:text-[10px]',
                slotBg,
                slotText,
              )}
            >
              {item}
            </span>
          ))}
        </div>

        {availability.moreCount > 0 && (
          <span className='text-xs lg:text-[10px] font-medium rounded-full px-2 py-0.5 text-white flex items-center gap-0.5 ml-auto bg-[#A0A0A0]'>
            +{availability.moreCount}
            <ArrowIcon />
          </span>
        )}
      </div>
    </div>
  );
};

const ArrowIcon = () => (
  <svg
    width='9'
    height='14'
    viewBox='0 0 9 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7.27852 7.30953L2.90352 11.6845C2.86288 11.7252 2.81462 11.7574 2.76151 11.7794C2.7084 11.8014 2.65148 11.8127 2.59399 11.8127C2.53651 11.8127 2.47959 11.8014 2.42648 11.7794C2.37337 11.7574 2.32511 11.7252 2.28446 11.6845C2.24381 11.6439 2.21157 11.5956 2.18957 11.5425C2.16757 11.4894 2.15625 11.4325 2.15625 11.375C2.15625 11.3175 2.16757 11.2606 2.18957 11.2075C2.21157 11.1544 2.24381 11.1061 2.28446 11.0655L6.35048 7L2.28446 2.93453C2.20237 2.85244 2.15625 2.7411 2.15625 2.625C2.15625 2.5089 2.20237 2.39756 2.28446 2.31547C2.36655 2.23338 2.4779 2.18726 2.59399 2.18726C2.71009 2.18726 2.82143 2.23338 2.90352 2.31547L7.27852 6.69047C7.3192 6.7311 7.35147 6.77935 7.37349 6.83246C7.3955 6.88557 7.40684 6.9425 7.40684 7C7.40684 7.05749 7.3955 7.11442 7.37349 7.16754C7.35147 7.22065 7.3192 7.2689 7.27852 7.30953Z'
      fill='white'
    />
  </svg>
);
