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
      slots: ['12:00'],
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

export interface Service {
  id: number;
  name: string;
  price: number;
  isSelected?: boolean; // для чекбоксов на фронте
}

export interface CalendarDay {
  date: string;
  label: string;
  slotsCount: number;
  isAvailable: boolean;
  times: string[]; // Теперь слоты живут прямо здесь
}

export interface Review {
  id: number;
  patientName: string;
  patientAvatar?: string; // путь к аватарке
  date: string; // "Вчера 12:36" или "2026-03-15 12:36"
  rating: number;
  text: string;
}

export interface DoctorDetail {
  id: number;
  fullName: string;
  photo: typeof item1; // StaticImageData
  specialties: string[]; // ["Гинеколог", "Гинеколог-эндокринолог"]
  rating: number;
  ratingCount?: number; // если хочешь показывать (127)
  experienceYears: number;
  availabilityCalendar: CalendarDay[];
  selectedDate: string; // текущая выбранная дата по умолчанию
  availableTimes: string[]; // слоты на выбранную дату
  services: Service[];
  reviews: Review[];
  totalReviewsCount: number;
}

// Пример данных (можно положить в отдельный файл data/doctors-detail.ts)
export const DOCTORS_DETAILS_LIST: DoctorDetail[] = [
  {
    id: 1,
    fullName: 'Сурапбеков Бекмамат Султангазиевич',
    photo: item1,
    specialties: ['Гинеколог', 'Гинеколог-эндокринолог'],
    rating: 4.8,
    experienceYears: 12,
    availabilityCalendar: [
      {
        date: '2026-03-12',
        label: 'Сегодня',
        slotsCount: 3,
        isAvailable: true,
        times: ['08:30', '09:40', '11:30'],
      },
      {
        date: '2026-03-13',
        label: '13 мар',
        slotsCount: 5,
        isAvailable: true,
        times: ['15:00', '17:30', '19:20', '20:00', '21:00'],
      },
      {
        date: '2026-03-14',
        label: '14 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-15',
        label: '15 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-16',
        label: '16 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['09:00', '10:00'],
      },
      {
        date: '2026-03-17',
        label: '17 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['12:00', '13:00', '14:00'],
      },
      {
        date: '2026-03-18',
        label: '18 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['15:00', '16:00', '17:00'],
      },
      {
        date: '2026-03-19',
        label: '19 мар',
        slotsCount: 4,
        isAvailable: true,
        times: ['08:00', '09:00', '10:00', '11:00'],
      },
      {
        date: '2026-03-20',
        label: '20 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['18:00', '19:00'],
      },
      {
        date: '2026-03-21',
        label: '21 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-22',
        label: '22 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-23',
        label: '23 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['10:00', '11:00', '12:00'],
      },
      {
        date: '2026-03-24',
        label: '24 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['13:00', '14:00', '15:00'],
      },
      {
        date: '2026-03-25',
        label: '25 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['16:00', '17:00', '18:00'],
      },
      {
        date: '2026-03-26',
        label: '26 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['09:00', '10:00', '11:00'],
      },
      {
        date: '2026-03-27',
        label: '27 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['12:00', '13:00', '14:00'],
      },
      {
        date: '2026-03-28',
        label: '28 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-29',
        label: '29 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-30',
        label: '30 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['10:00', '11:00'],
      },
      {
        date: '2026-03-31',
        label: '31 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['12:00', '13:00'],
      },
      {
        date: '2026-04-01',
        label: '1 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['14:00', '15:00'],
      },
      {
        date: '2026-04-02',
        label: '2 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['16:00', '17:00'],
      },
      {
        date: '2026-04-03',
        label: '3 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['18:00', '19:00'],
      },
      {
        date: '2026-04-04',
        label: '4 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-05',
        label: '5 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-06',
        label: '6 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['08:00'],
      },
      {
        date: '2026-04-07',
        label: '7 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['09:00'],
      },
      {
        date: '2026-04-08',
        label: '8 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['10:00'],
      },
      {
        date: '2026-04-09',
        label: '9 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['11:00'],
      },
      {
        date: '2026-04-10',
        label: '10 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['12:00'],
      },
    ],
    selectedDate: '2026-03-12',
    availableTimes: ['08:30', '09:40', '11:30'], // Копия times для выбранного дня
    services: [
      { id: 1, name: 'Общий осмотр', price: 1500, isSelected: true },
      { id: 2, name: 'Осмотр в зеркалах', price: 1500 },
      { id: 3, name: 'Сдача анализов', price: 1500 },
      { id: 4, name: 'Планирование семьи', price: 1500 },
      { id: 5, name: 'Лечение бесплодия', price: 1500 },
      { id: 6, name: 'Сбор анамнеза', price: 1500 },
    ],
    reviews: [
      {
        id: 1,
        patientName: 'Самат Досалиев',
        date: 'Вчера 12:36',
        rating: 5,
        text: 'tempor Vestibulum Quisque odio Praesent efficitur, venenatis placerat laoreet sapien fringilla Lorem Nunc ultrices amet',
      },
      {
        id: 2,
        patientName: 'Самат Досалиев',
        date: 'Вчера 12:36',
        rating: 5,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ],
    totalReviewsCount: 127,
  },
  {
    id: 2,
    fullName: 'Адьлбекова Алина Адьлбековна',
    photo: item2,
    specialties: ['Физиотерапевт'],
    rating: 4.9,
    experienceYears: 8,
    availabilityCalendar: [
      {
        date: '2026-03-12',
        label: 'Сегодня',
        slotsCount: 2,
        isAvailable: true,
        times: ['12:00', '08:00'],
      },
      {
        date: '2026-03-13',
        label: 'Завтра',
        slotsCount: 4,
        isAvailable: true,
        times: ['10:00', '11:00', '14:00', '15:00'],
      },
      {
        date: '2026-03-14',
        label: '14 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-15',
        label: '15 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-16',
        label: '16 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['09:00', '10:30', '12:00'],
      },
      {
        date: '2026-03-17',
        label: '17 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['14:00', '15:00'],
      },
      {
        date: '2026-03-18',
        label: '18 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['08:00', '09:00', '11:00'],
      },
      {
        date: '2026-03-19',
        label: '19 мар',
        slotsCount: 5,
        isAvailable: true,
        times: ['13:00', '14:00', '15:00', '16:00', '17:00'],
      },
      {
        date: '2026-03-20',
        label: '20 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['10:00', '11:00'],
      },
      {
        date: '2026-03-21',
        label: '21 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-22',
        label: '22 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-23',
        label: '23 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['09:00', '10:00', '11:00'],
      },
      {
        date: '2026-03-24',
        label: '24 мар',
        slotsCount: 4,
        isAvailable: true,
        times: ['12:00', '13:00', '14:00', '15:00'],
      },
      {
        date: '2026-03-25',
        label: '25 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['08:00', '09:30'],
      },
      {
        date: '2026-03-26',
        label: '26 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['16:00', '17:00', '18:00'],
      },
      {
        date: '2026-03-27',
        label: '27 мар',
        slotsCount: 4,
        isAvailable: true,
        times: ['10:00', '11:00', '12:00', '13:00'],
      },
      {
        date: '2026-03-28',
        label: '28 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-29',
        label: '29 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-30',
        label: '30 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['09:00', '10:00', '11:00'],
      },
      {
        date: '2026-03-31',
        label: '31 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['14:00', '15:00', '16:00'],
      },
      {
        date: '2026-04-01',
        label: '1 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['12:00', '13:00'],
      },
      {
        date: '2026-04-02',
        label: '2 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['08:00', '09:00'],
      },
      {
        date: '2026-04-03',
        label: '3 апр',
        slotsCount: 5,
        isAvailable: true,
        times: ['15:00', '16:00', '17:00', '18:00', '19:00'],
      },
      {
        date: '2026-04-04',
        label: '4 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-05',
        label: '5 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-06',
        label: '6 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['10:00', '11:00'],
      },
      {
        date: '2026-04-07',
        label: '7 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['12:00', '13:00'],
      },
      {
        date: '2026-04-08',
        label: '8 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['14:00', '15:00'],
      },
      {
        date: '2026-04-09',
        label: '9 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['16:00'],
      },
      {
        date: '2026-04-10',
        label: '10 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['17:00'],
      },
    ],
    selectedDate: '2026-03-12',
    availableTimes: ['12:00', '08:00'],
    services: [
      { id: 1, name: 'Первичная консультация', price: 1200, isSelected: true },
      { id: 2, name: 'Мануальная терапия', price: 2500 },
    ],
    reviews: [],
    totalReviewsCount: 45,
  },
  {
    id: 3,
    fullName: 'Буудайбекова Мээрим Улановна',
    photo: item3,
    specialties: ['Физиотерапевт'],
    rating: 5.0,
    experienceYears: 5,
    availabilityCalendar: [
      {
        date: '2026-03-12',
        label: 'Сегодня',
        slotsCount: 3,
        isAvailable: true,
        times: ['12:00', '08:00', '08:30'],
      },
      {
        date: '2026-03-13',
        label: 'Завтра',
        slotsCount: 1,
        isAvailable: true,
        times: ['09:00'],
      },
      {
        date: '2026-03-14',
        label: '14 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-15',
        label: '15 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-16',
        label: '16 мар',
        slotsCount: 4,
        isAvailable: true,
        times: ['08:00', '09:00', '10:00', '11:00'],
      },
      {
        date: '2026-03-17',
        label: '17 мар',
        slotsCount: 4,
        isAvailable: true,
        times: ['12:00', '13:00', '14:00', '15:00'],
      },
      {
        date: '2026-03-18',
        label: '18 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['16:00', '17:00', '18:00'],
      },
      {
        date: '2026-03-19',
        label: '19 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['10:00', '11:00'],
      },
      {
        date: '2026-03-20',
        label: '20 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['08:00', '09:00'],
      },
      {
        date: '2026-03-21',
        label: '21 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-22',
        label: '22 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-23',
        label: '23 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['13:00', '14:00', '15:00'],
      },
      {
        date: '2026-03-24',
        label: '24 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['16:00', '17:00', '18:00'],
      },
      {
        date: '2026-03-25',
        label: '25 мар',
        slotsCount: 3,
        isAvailable: true,
        times: ['08:00', '09:00', '10:00'],
      },
      {
        date: '2026-03-26',
        label: '26 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['11:00', '12:00'],
      },
      {
        date: '2026-03-27',
        label: '27 мар',
        slotsCount: 2,
        isAvailable: true,
        times: ['14:00', '15:00'],
      },
      {
        date: '2026-03-28',
        label: '28 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-29',
        label: '29 мар',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-30',
        label: '30 мар',
        slotsCount: 1,
        isAvailable: true,
        times: ['10:00'],
      },
      {
        date: '2026-03-31',
        label: '31 мар',
        slotsCount: 1,
        isAvailable: true,
        times: ['11:00'],
      },
      {
        date: '2026-04-01',
        label: '1 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['12:00'],
      },
      {
        date: '2026-04-02',
        label: '2 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['13:00'],
      },
      {
        date: '2026-04-03',
        label: '3 апр',
        slotsCount: 1,
        isAvailable: true,
        times: ['14:00'],
      },
      {
        date: '2026-04-04',
        label: '4 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-05',
        label: '5 апр',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-04-06',
        label: '6 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['09:00', '10:00'],
      },
      {
        date: '2026-04-07',
        label: '7 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['11:00', '12:00'],
      },
      {
        date: '2026-04-08',
        label: '8 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['13:00', '14:00'],
      },
      {
        date: '2026-04-09',
        label: '9 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['15:00', '16:00'],
      },
      {
        date: '2026-04-10',
        label: '10 апр',
        slotsCount: 2,
        isAvailable: true,
        times: ['17:00', '18:00'],
      },
    ],
    selectedDate: '2026-03-12',
    availableTimes: ['12:00', '08:00', '08:00'],
    services: [
      { id: 1, name: 'ЛФК сессия', price: 1000 },
      { id: 2, name: 'Электрофорез', price: 800 },
    ],
    reviews: [],
    totalReviewsCount: 12,
  },
  {
    id: 4,
    fullName: 'Князев Игорь Алексеевич',
    photo: item4,
    specialties: ['Физиотерапевт'],
    rating: 4.7,
    experienceYears: 15,
    availabilityCalendar: [
      {
        date: '2026-03-12',
        label: 'Сегодня',
        slotsCount: 0,
        isAvailable: false,
        times: [],
      },
      {
        date: '2026-03-15',
        label: '15 марта',
        slotsCount: 3,
        isAvailable: true,
        times: ['12:00'],
      },
      // ... еще 28 дней
    ],
    selectedDate: '2026-03-15',
    availableTimes: ['12:00'],
    services: [{ id: 1, name: 'Прием специалиста', price: 2000, isSelected: true }],
    reviews: [],
    totalReviewsCount: 89,
  },
  {
    id: 5,
    fullName: 'Тынарбекова Жылдыз Эмилбековна',
    photo: item5,
    specialties: ['Физиотерапевт'],
    rating: 4.8,
    experienceYears: 10,
    availabilityCalendar: [
      {
        date: '2026-03-13',
        label: '13 марта',
        slotsCount: 3,
        isAvailable: true,
        times: ['12:00', '12:00', '12:00'],
      },
      // ... еще 29 дней
    ],
    selectedDate: '2026-03-13',
    availableTimes: ['12:00', '12:00', '12:00'],
    services: [{ id: 1, name: 'Массаж спины', price: 1800 }],
    reviews: [],
    totalReviewsCount: 34,
  },
  {
    id: 6,
    fullName: 'Исаева Айсулуу Камиловна',
    photo: item5, // Используем item5 как заглушку
    specialties: ['Физиотерапевт'],
    rating: 4.9,
    experienceYears: 7,
    availabilityCalendar: [
      {
        date: '2026-03-13',
        label: '13 марта',
        slotsCount: 2,
        isAvailable: true,
        times: ['12:00', '08:00'],
      },
      // ... еще 29 дней
    ],
    selectedDate: '2026-03-13',
    availableTimes: ['12:00', '08:00'],
    services: [{ id: 1, name: 'Консультация', price: 1300 }],
    reviews: [],
    totalReviewsCount: 21,
  },
];
