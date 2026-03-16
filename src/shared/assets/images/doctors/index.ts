import item1 from './1.jpg';
import item2 from './2.jpg';
import item3 from './3.jpg';
import item4 from './4.jpg';
import item5 from './5.jpg';

export interface Availability {
  label: string; // "Сегодня", "Завтра", "13 марта" и т.п.
  slots: string[]; // видимые слоты
  moreCount: number; // сколько ещё скрыто → +N
}

export interface DoctorPreview {
  id: number;
  fullName: string;
  photo: typeof item1; // StaticImageData в Next.js
  specialty: string;
  availability: Availability;
}

export const DOCTORS_LIST: DoctorPreview[] = [
  {
    id: 1,
    fullName: 'Князев Игорь Алексеевич',
    photo: item1,
    specialty: 'Физиотерапевт',
    availability: {
      label: 'Сегодня',
      slots: ['12:00', '8:00', '22:00'],
      moreCount: 3,
    },
  },
  {
    id: 2,
    fullName: 'Адьлбекова Алина Адьлбековна',
    photo: item2,
    specialty: 'Физиотерапевт',
    availability: {
      label: 'Завтра',
      slots: ['12:00', '8:00'],
      moreCount: 4,
    },
  },
  {
    id: 3,
    fullName: 'Буудайбекова Мээрим Улановна',
    photo: item3,
    specialty: 'Физиотерапевт',
    availability: {
      label: 'Завтра',
      slots: ['12:00', '8:00', '8:00'],
      moreCount: 0,
    },
  },
  {
    id: 4,
    fullName: 'Князев Игорь Алексеевич',
    photo: item4,
    specialty: 'Физиотерапевт',
    availability: {
      label: '15 марта',
      slots: ['12:00', '8:00', '22:00'],
      moreCount: 3,
    },
  },
  {
    id: 5,
    fullName: 'Тынарбекова Жылдыз Эмилбековна',
    photo: item5,
    specialty: 'Физиотерапевт',
    availability: {
      label: '13 марта',
      slots: ['12:00', '12:00', '12:00'],
      moreCount: 0,
    },
  },
];
