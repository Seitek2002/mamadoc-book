import clsx from 'clsx';
import { CalendarDay } from '@/shared/assets/images/doctors';

type Props = {
  data: CalendarDay;
  isActive: boolean;
  onClick: () => void;
};

export const DoctorsScheduleItem = ({ data, isActive, onClick }: Props) => {
  const isToday = data.label === 'Сегодня';
  const isTomorrow = data.label === 'Завтра';
  const isFarDate = !isToday && !isTomorrow;

  const dateObj = new Date(data.date);
  const dayOfWeek = dateObj
    .toLocaleDateString('ru-RU', { weekday: 'short' })
    .replace('.', '');
  const dayMonth = dateObj
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    .replace('.', '');

  const getSlotsLabel = (count: number) => {
    if (count === 0) return 'Нет окон';
    if (count === 1) return '1 окно';
    if (count > 1 && count < 5) return `${count} окна`;
    return `${count} окон`;
  };

  return (
    <div
      onClick={data.isAvailable ? onClick : undefined}
      className={clsx(
        'flex flex-col border relative rounded-[10px] w-20 h-15 lg:w-auto lg:h-20 font-semibold p-2 transition-all cursor-pointer',
        !data.isAvailable && 'opacity-30 grayscale-[0.5] cursor-not-allowed',
        isActive ? 'bg-mint-100 border-success' : 'border-sky bg-[#ECF1FB]',
      )}
    >
      {!isFarDate && (
        <div
          className={clsx(
            'absolute text-[8px] px-1.5 border bg-white rounded-full -top-1.5 left-1.5 whitespace-nowrap transition-all',
            isActive
              ? 'text-success border-success'
              : 'text-primary border-primary',
          )}
        >
          {dayMonth}
        </div>
      )}

      <span
        className={clsx(
          'text-xs lg:text-sm flex justify-between items-center capitalize transition-all text-nowrap',
          isActive ? 'text-success' : 'text-primary',
        )}
      >
        {data.label}
        {isFarDate && (
          <div
            className={clsx(
              'bg-white size-3.5 shrink-0 text-[7px] border rounded-full flex justify-center items-center uppercase transition-all',
              isActive
                ? 'text-success border-success'
                : 'text-primary border-primary',
            )}
          >
            {dayOfWeek}
          </div>
        )}
      </span>

      <span
        className={clsx(
          'text-[10px] lg:text-xs text-center text-nowrap font-semibold text-white py-0.5 rounded-full w-full mt-auto transition-all',
          isActive ? 'bg-success' : 'bg-primary',
        )}
      >
        {getSlotsLabel(data.slotsCount)}
      </span>
    </div>
  );
};
