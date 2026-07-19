import clsx from 'clsx';
import { ApiCalendarDay } from '@/shared/mock';

type Props = {
  data: ApiCalendarDay;
  isActive: boolean;
  onClick: () => void;
};

const getSlotsLabel = (count: number) => {
  if (count === 0) return 'нет окон';
  if (count === 1) return '1 окно';
  if (count > 1 && count < 5) return `${count} окна`;
  return `${count} окон`;
};

export const DoctorsScheduleItem = ({ data, isActive, onClick }: Props) => {
  const isSpecial = data.label === 'Сегодня' || data.label === 'Завтра';

  const dateObj = new Date(data.date);
  const weekday = dateObj
    .toLocaleDateString('ru-RU', { weekday: 'short' })
    .replace('.', '');
  const dayNum = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString('ru-RU', { month: 'short' })
    .replace('.', '');

  const topLabel = isSpecial ? data.label : weekday;

  return (
    <button
      type='button'
      onClick={data.is_available ? onClick : undefined}
      disabled={!data.is_available}
      className={clsx(
        'flex flex-col items-center justify-between shrink-0 snap-start w-16.5 md:w-auto h-22 rounded-xl border px-1 py-2 transition-all select-none',
        isActive
          ? 'bg-[#007BFF] border-[#007BFF] shadow-[0_6px_16px_rgba(0,123,255,0.28)] cursor-pointer'
          : data.is_available
          ? 'bg-white border-[#E7E7EE] hover:border-[#8FC0FF] hover:shadow-sm cursor-pointer'
          : 'bg-[#FAFAFB] border-[#F0F1F4] cursor-not-allowed',
      )}
    >
      <span
        className={clsx(
          'text-[9px] font-semibold uppercase tracking-wide leading-none whitespace-nowrap',
          isActive
            ? 'text-white/85'
            : !data.is_available
            ? 'text-[#C6CAD2]'
            : isSpecial
            ? 'text-[#007BFF]'
            : 'text-[#98A2B3]',
        )}
      >
        {topLabel}
      </span>

      <span
        className={clsx(
          'text-xl font-bold leading-none tabular-nums',
          isActive
            ? 'text-white'
            : data.is_available
            ? 'text-[#312E2E]'
            : 'text-[#C6CAD2]',
        )}
      >
        {dayNum}
      </span>

      <span
        className={clsx(
          'text-[9px] font-medium leading-none',
          isActive
            ? 'text-white/85'
            : data.is_available
            ? 'text-[#7A7878]'
            : 'text-[#C6CAD2]',
        )}
      >
        {month}
      </span>

      <span
        className={clsx(
          'text-[8px] font-semibold leading-none px-1.5 py-1 rounded-full whitespace-nowrap',
          isActive
            ? 'bg-white/20 text-white'
            : data.is_available
            ? 'bg-[#E9F9EE] text-[#1FA84A]'
            : 'text-[#C6CAD2]',
        )}
      >
        {getSlotsLabel(data.slots_count)}
      </span>
    </button>
  );
};
