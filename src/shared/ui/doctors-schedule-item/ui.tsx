import clsx from 'clsx';
import { CalendarDay } from '@/shared/assets/images/doctors';

type Props = {
  data: CalendarDay;
};

export const DoctorsScheduleItem = ({ data }: Props) => {
  const isToday = data.label === 'Сегодня';
  const isTomorrow = data.label === 'Завтра';
  // Если это не сегодня и не завтра — значит это "дальняя" дата
  const isFarDate = !isToday && !isTomorrow;

  // Парсим дату для динамики
  const dateObj = new Date(data.date);

  // Получаем день недели (Чт, Пт...)
  const dayOfWeek = dateObj
    .toLocaleDateString('ru-RU', { weekday: 'short' })
    .replace('.', ''); // Убираем точки, если есть

  // Получаем число и месяц для баджа (12 мар)
  const dayMonth = dateObj
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    .replace('.', '');

  // Функция для склонения слова "окно"
  const getSlotsLabel = (count: number) => {
    if (count === 0) return 'Нет окон';
    if (count === 1) return '1 окно';
    if (count > 1 && count < 5) return `${count} окна`;
    return `${count} окон`;
  };

  return (
    <div
      className={clsx(
        'flex flex-col border relative rounded-[10px] w-20 h-15 font-semibold p-2 transition-all',
        !data.isAvailable && 'opacity-30 grayscale-[0.5]',
        isToday ? 'bg-mint-100 border-success' : 'border-sky bg-[#ECF1FB]',
      )}
    >
      {/* Бадж с датой показываем только для "Сегодня" и "Завтра" */}
      {!isFarDate && (
        <div
          className={clsx(
            'absolute text-[8px] px-1.5 border bg-white rounded-full -top-1.5 left-1.5 whitespace-nowrap',
            isToday
              ? 'text-success border-success'
              : 'text-primary border-primary',
          )}
        >
          {dayMonth}
        </div>
      )}

      <span
        className={clsx(
          'text-[12px] flex justify-between items-center capitalize',
          isToday ? 'text-success' : 'text-primary',
        )}
      >
        {data.label}

        {/* Иконка дня недели показывается только для обычных дат (не сег/завтра) */}
        {isFarDate && (
          <div className='text-primary bg-white size-3.5 shrink-0 text-[7px] border border-primary rounded-full flex justify-center items-center uppercase'>
            {dayOfWeek}
          </div>
        )}
      </span>

      <span
        className={clsx(
          'text-[10px] text-center text-nowrap font-semibold text-white py-0.5 rounded-full w-full mt-auto',
          isToday ? 'bg-success' : 'bg-primary',
        )}
      >
        {getSlotsLabel(data.slotsCount)}
      </span>
    </div>
  );
};
