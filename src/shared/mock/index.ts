import doctor1 from '@/shared/assets/images/doctors/1.jpg';
import doctor2 from '@/shared/assets/images/doctors/2.jpg';
import doctor3 from '@/shared/assets/images/doctors/3.jpg';
import doctor4 from '@/shared/assets/images/doctors/4.jpg';
import doctor5 from '@/shared/assets/images/doctors/5.jpg';

import imgAkusher from '@/shared/assets/images/specialists/akusher.png';
import imgAllergolog from '@/shared/assets/images/specialists/allergolog.png';
import imgAnastetika from '@/shared/assets/images/specialists/anastetika.png';
import imgDentist from '@/shared/assets/images/specialists/dentist.png';
import imgDermatolog from '@/shared/assets/images/specialists/dermatolog.png';
import imgEndokrinolog from '@/shared/assets/images/specialists/endokrinolog.png';
import imgFizioterapeft from '@/shared/assets/images/specialists/fizioterapeft.png';
import imgGastro from '@/shared/assets/images/specialists/gastro.png';
import imgHirurg from '@/shared/assets/images/specialists/hirurg.png';
import imgKardiolog from '@/shared/assets/images/specialists/kardiolog.png';
import imgLor from '@/shared/assets/images/specialists/lor.png';
import imgNeirohirurg from '@/shared/assets/images/specialists/neirohirurg.png';
import imgOftalmolog from '@/shared/assets/images/specialists/oftalmolog.png';
import imgOnkolog from '@/shared/assets/images/specialists/onkolog.png';
import imgOrtodont from '@/shared/assets/images/specialists/ortodont.png';
import imgPsihiatr from '@/shared/assets/images/specialists/psihiatr.png';
import imgRevmatolog from '@/shared/assets/images/specialists/revmatolog.png';
import imgTerapeft from '@/shared/assets/images/specialists/terapeft.png';
import imgVenerolog from '@/shared/assets/images/specialists/venerolog.png';

// ─── Типы API-ответов ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface ApiPaginatedResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiSpecialist {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface ApiAvailability {
  label: string;
  slots: string[];
  more_count: number;
}

export interface ApiDoctorPreview {
  id: number;
  full_name: string;
  photo_url: string;
  specialty: string;
  rating: number;
  experience_years: number;
  availability: ApiAvailability;
}

export interface ApiService {
  id: number;
  name: string;
  price: number;
  duration_min?: number;
  description?: string | null;
}

export interface ApiReview {
  id: number;
  patient_name: string;
  client_avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface ApiCalendarDay {
  date: string;
  label: string;
  is_available: boolean;
  slots_count: number;
  times: string[];
}

export interface ApiDoctorDetail {
  id: number;
  full_name: string;
  photo_url: string;
  specialties: string[];
  rating: number;
  rating_count: number;
  experience_years: number;
  bio: string;
  education: string;
  clinic_name: string;
  clinic_address: string;
  consultation_type: 'offline' | 'online' | 'both';
  languages: string[];
  is_accepting_new: boolean;
  is_active: boolean;
  gender: 'male' | 'female';
  slot_duration_min: number;
  services: ApiService[];
  reviews: {
    total_count: number;
    items: ApiReview[];
  };
  paylink_enabled?: boolean;
}

export interface ApiFeatureFlags {
  branches_enabled: boolean;
  paylink_enabled: boolean;
  paylink_by_organization?: boolean;
  paylink_by_professional?: boolean;
}

export interface ApiPhoneCountry {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

export interface ApiBranch {
  id: number;
  organization_id: number;
  organization_name: string;
  title: string;
  address: string;
  professionals_count: number;
}

export interface ApiOrganizationPreview {
  id: number;
  name: string;
  logo_url?: string;
  paylink_enabled: boolean;
  specialists_count: number;
  professionals_count: number;
  services_count?: number;
}

export interface ApiOrganizationDetail {
  id: number;
  name: string;
  logo_url?: string;
  paylink_enabled: boolean;
  specialists_count: number;
  professionals_count: number;
  services_count?: number;
  branches: Record<string, unknown>[];
}

// ─── Специализации ───────────────────────────────────────────────────────────

export const MOCK_SPECIALISTS: ApiResponse<ApiSpecialist[]> = {
  data: [
    { id: 1,  title: 'Акушер',          slug: 'akusher',        description: 'Специалист по ведению беременности и родов',             icon_url: imgAkusher.src,       is_active: true, sort_order: 1  },
    { id: 2,  title: 'Аллерголог',      slug: 'allergolog',     description: 'Диагностика и лечение аллергических заболеваний',        icon_url: imgAllergolog.src,    is_active: true, sort_order: 2  },
    { id: 3,  title: 'Анестезиолог',    slug: 'anesteziolog',   description: 'Обеспечение анестезии при хирургических вмешательствах', icon_url: imgAnastetika.src,    is_active: true, sort_order: 3  },
    { id: 4,  title: 'Стоматолог',      slug: 'stomatolog',     description: 'Лечение и профилактика заболеваний зубов',               icon_url: imgDentist.src,       is_active: true, sort_order: 4  },
    { id: 5,  title: 'Дерматолог',      slug: 'dermatolog',     description: 'Лечение заболеваний кожи, волос и ногтей',               icon_url: imgDermatolog.src,    is_active: true, sort_order: 5  },
    { id: 6,  title: 'Эндокринолог',    slug: 'endokrinolog',   description: 'Диагностика и лечение болезней эндокринной системы',     icon_url: imgEndokrinolog.src,  is_active: true, sort_order: 6  },
    { id: 7,  title: 'Физиотерапевт',   slug: 'fizioterapevt',  description: 'Восстановительное лечение физическими факторами',        icon_url: imgFizioterapeft.src, is_active: true, sort_order: 7  },
    { id: 8,  title: 'Гастроэнтеролог', slug: 'gastroenterolog',description: 'Диагностика и лечение болезней ЖКТ',                    icon_url: imgGastro.src,        is_active: true, sort_order: 8  },
    { id: 9,  title: 'Хирург',          slug: 'hirurg',         description: 'Хирургическое лечение различных заболеваний',            icon_url: imgHirurg.src,        is_active: true, sort_order: 9  },
    { id: 10, title: 'Кардиолог',       slug: 'kardiolog',      description: 'Диагностика и лечение болезней сердца',                  icon_url: imgKardiolog.src,     is_active: true, sort_order: 10 },
    { id: 11, title: 'ЛОР',             slug: 'lor',            description: 'Лечение болезней уха, горла и носа',                    icon_url: imgLor.src,           is_active: true, sort_order: 11 },
    { id: 12, title: 'Нейрохирург',     slug: 'neyrohirurg',    description: 'Хирургическое лечение болезней нервной системы',         icon_url: imgNeirohirurg.src,   is_active: true, sort_order: 12 },
    { id: 13, title: 'Офтальмолог',     slug: 'oftalmolog',     description: 'Диагностика и лечение болезней глаз',                   icon_url: imgOftalmolog.src,    is_active: true, sort_order: 13 },
    { id: 14, title: 'Онколог',         slug: 'onkolog',        description: 'Диагностика и лечение онкологических заболеваний',       icon_url: imgOnkolog.src,       is_active: true, sort_order: 14 },
    { id: 15, title: 'Ортодонт',        slug: 'ortodont',       description: 'Исправление прикуса и выравнивание зубов',               icon_url: imgOrtodont.src,      is_active: true, sort_order: 15 },
    { id: 16, title: 'Психиатр',        slug: 'psihiatr',       description: 'Диагностика и лечение психических расстройств',          icon_url: imgPsihiatr.src,      is_active: true, sort_order: 16 },
    { id: 17, title: 'Ревматолог',      slug: 'revmatolog',     description: 'Лечение болезней суставов и соединительной ткани',       icon_url: imgRevmatolog.src,    is_active: true, sort_order: 17 },
    { id: 18, title: 'Терапевт',        slug: 'terapevt',       description: 'Первичная диагностика и лечение внутренних болезней',    icon_url: imgTerapeft.src,      is_active: true, sort_order: 18 },
    { id: 19, title: 'Венеролог',       slug: 'venerolog',      description: 'Диагностика и лечение инфекций, передаваемых половым путём', icon_url: imgVenerolog.src,  is_active: true, sort_order: 19 },
  ],
};

// ─── Список врачей (карточки) ────────────────────────────────────────────────

export const MOCK_DOCTORS_LIST: ApiPaginatedResponse<ApiDoctorPreview[]> = {
  data: [
    {
      id: 1,
      full_name: 'Сурапбеков Бекмамат Султангазиевич',
      photo_url: doctor1.src,
      specialty: 'Гинеколог',
      rating: 4.8,
      experience_years: 12,
      availability: { label: 'Сегодня', slots: ['08:30', '09:40', '11:30'], more_count: 3 },
    },
    {
      id: 2,
      full_name: 'Адьлбекова Алина Адьлбековна',
      photo_url: doctor2.src,
      specialty: 'Физиотерапевт',
      rating: 4.9,
      experience_years: 8,
      availability: { label: 'Завтра', slots: ['12:00', '08:00'], more_count: 4 },
    },
    {
      id: 3,
      full_name: 'Буудайбекова Мээрим Улановна',
      photo_url: doctor3.src,
      specialty: 'Физиотерапевт',
      rating: 5.0,
      experience_years: 5,
      availability: { label: 'Завтра', slots: ['12:00', '08:00', '08:30'], more_count: 0 },
    },
    {
      id: 4,
      full_name: 'Князев Игорь Алексеевич',
      photo_url: doctor4.src,
      specialty: 'Физиотерапевт',
      rating: 4.7,
      experience_years: 15,
      availability: { label: '15 марта', slots: ['12:00'], more_count: 3 },
    },
    {
      id: 5,
      full_name: 'Тынарбекова Жылдыз Эмилбековна',
      photo_url: doctor5.src,
      specialty: 'Физиотерапевт',
      rating: 4.8,
      experience_years: 10,
      availability: { label: '13 марта', slots: ['12:00', '14:00', '16:00'], more_count: 0 },
    },
    {
      id: 6,
      full_name: 'Исаева Айсулуу Камиловна',
      photo_url: doctor5.src,
      specialty: 'Физиотерапевт',
      rating: 4.9,
      experience_years: 7,
      availability: { label: '13 марта', slots: ['12:00', '08:00'], more_count: 0 },
    },
  ],
  pagination: { page: 1, limit: 10, total: 6 },
};

// ─── Детали врачей ───────────────────────────────────────────────────────────

export const MOCK_DOCTORS_DETAILS: Record<number, ApiResponse<ApiDoctorDetail>> = {
  1: {
    data: {
      id: 1,
      full_name: 'Сурапбеков Бекмамат Султангазиевич',
      photo_url: doctor1.src,
      specialties: ['Гинеколог', 'Гинеколог-эндокринолог'],
      rating: 4.8,
      rating_count: 127,
      experience_years: 12,
      bio: 'Опытный специалист в области гинекологии и гинекологической эндокринологии. Ведёт приём взрослых пациентов, специализируется на лечении бесплодия и гормональных нарушений.',
      education: 'КГМА им. И.К. Ахунбаева, 2010 г. Ординатура по акушерству и гинекологии.',
      clinic_name: 'МедЦентр Плюс',
      clinic_address: 'Орозбекова 112, Бишкек',
      consultation_type: 'offline',
      languages: ['ru', 'kg'],
      is_accepting_new: true,
      is_active: true,
      gender: 'male',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'Общий осмотр',       price: 1500, duration_min: 30 },
        { id: 2, name: 'Осмотр в зеркалах',  price: 1500, duration_min: 20 },
        { id: 3, name: 'Сдача анализов',      price: 1500, duration_min: 15 },
        { id: 4, name: 'Планирование семьи',  price: 1500, duration_min: 40 },
        { id: 5, name: 'Лечение бесплодия',   price: 1500, duration_min: 60 },
        { id: 6, name: 'Сбор анамнеза',       price: 1500, duration_min: 20 },
      ],
      reviews: {
        total_count: 127,
        items: [
          {
            id: 1,
            patient_name: 'Самат Досалиев',
            client_avatar: '',
            rating: 5,
            text: 'Очень внимательный специалист, всё подробно объяснил. Рекомендую!',
            date: '2026-05-16',
          },
          {
            id: 2,
            patient_name: 'Айгуль М.',
            client_avatar: '',
            rating: 5,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            date: '2026-05-16',
          },
        ],
      },
    },
  },

  2: {
    data: {
      id: 2,
      full_name: 'Адьлбекова Алина Адьлбековна',
      photo_url: doctor2.src,
      specialties: ['Физиотерапевт'],
      rating: 4.9,
      rating_count: 45,
      experience_years: 8,
      bio: 'Специалист по физиотерапии и мануальной терапии. Помогает пациентам с болями в спине, суставах и последствиями травм.',
      education: 'КРСУ им. Б.Н. Ельцина, 2016 г. Специальность: восстановительная медицина.',
      clinic_name: 'Клиника Здоровье',
      clinic_address: 'ул. Киевская 77, Бишкек',
      consultation_type: 'offline',
      languages: ['ru', 'kg'],
      is_accepting_new: true,
      is_active: true,
      gender: 'female',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'Первичная консультация', price: 1200, duration_min: 30 },
        { id: 2, name: 'Мануальная терапия',     price: 2500, duration_min: 45 },
      ],
      reviews: {
        total_count: 45,
        items: [],
      },
    },
  },

  3: {
    data: {
      id: 3,
      full_name: 'Буудайбекова Мээрим Улановна',
      photo_url: doctor3.src,
      specialties: ['Физиотерапевт'],
      rating: 5.0,
      rating_count: 12,
      experience_years: 5,
      bio: 'Молодой и перспективный специалист, работает с пациентами после операций и травм. Применяет современные методики ЛФК и физиолечения.',
      education: 'КГМА им. И.К. Ахунбаева, 2019 г. Специальность: лечебное дело.',
      clinic_name: 'Реабилитационный центр Vita',
      clinic_address: 'пр. Манаса 40, Бишкек',
      consultation_type: 'offline',
      languages: ['ru', 'kg'],
      is_accepting_new: true,
      is_active: true,
      gender: 'female',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'ЛФК сессия',   price: 1000, duration_min: 45 },
        { id: 2, name: 'Электрофорез', price: 800,  duration_min: 20 },
      ],
      reviews: {
        total_count: 12,
        items: [],
      },
    },
  },

  4: {
    data: {
      id: 4,
      full_name: 'Князев Игорь Алексеевич',
      photo_url: doctor4.src,
      specialties: ['Физиотерапевт'],
      rating: 4.7,
      rating_count: 89,
      experience_years: 15,
      bio: 'Ведущий физиотерапевт с 15-летним стажем. Специализируется на лечении хронических заболеваний опорно-двигательного аппарата.',
      education: 'Первый МГМУ им. Сеченова (Москва), 2009 г.',
      clinic_name: 'МедЦентр Плюс',
      clinic_address: 'Орозбекова 112, Бишкек',
      consultation_type: 'both',
      languages: ['ru'],
      is_accepting_new: true,
      is_active: true,
      gender: 'male',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'Прием специалиста', price: 2000, duration_min: 30 },
      ],
      reviews: {
        total_count: 89,
        items: [],
      },
    },
  },

  5: {
    data: {
      id: 5,
      full_name: 'Тынарбекова Жылдыз Эмилбековна',
      photo_url: doctor5.src,
      specialties: ['Физиотерапевт'],
      rating: 4.8,
      rating_count: 34,
      experience_years: 10,
      bio: 'Сертифицированный массажист и физиотерапевт. Работает с болями в спине, шейным остеохондрозом и послеродовым восстановлением.',
      education: 'Бишкекский медицинский колледж, 2014 г.',
      clinic_name: 'Студия массажа Body&Soul',
      clinic_address: 'ул. Токтогула 210, Бишкек',
      consultation_type: 'offline',
      languages: ['ru', 'kg'],
      is_accepting_new: true,
      is_active: true,
      gender: 'female',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'Массаж спины', price: 1800, duration_min: 60 },
      ],
      reviews: {
        total_count: 34,
        items: [],
      },
    },
  },

  6: {
    data: {
      id: 6,
      full_name: 'Исаева Айсулуу Камиловна',
      photo_url: doctor5.src,
      specialties: ['Физиотерапевт'],
      rating: 4.9,
      rating_count: 21,
      experience_years: 7,
      bio: 'Специалист по восстановительной медицине. Проводит комплексные программы реабилитации после травм и операций.',
      education: 'КГМА им. И.К. Ахунбаева, 2017 г.',
      clinic_name: 'Клиника Здоровье',
      clinic_address: 'ул. Киевская 77, Бишкек',
      consultation_type: 'offline',
      languages: ['ru', 'kg'],
      is_accepting_new: true,
      is_active: true,
      gender: 'female',
      slot_duration_min: 30,
      services: [
        { id: 1, name: 'Консультация', price: 1300, duration_min: 30 },
      ],
      reviews: {
        total_count: 21,
        items: [],
      },
    },
  },
};

// ─── Расписание (календарь) врачей ───────────────────────────────────────────

export const MOCK_CALENDARS: Record<number, ApiResponse<ApiCalendarDay[]>> = {
  1: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: true,  slots_count: 3, times: ['08:30', '09:40', '11:30'] },
      { date: '2026-05-18', label: '18 мая',  is_available: true,  slots_count: 5, times: ['15:00', '17:30', '19:20', '20:00', '21:00'] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 2, times: ['09:00', '10:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 3, times: ['12:00', '13:00', '14:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: true,  slots_count: 3, times: ['15:00', '16:00', '17:00'] },
      { date: '2026-05-24', label: '24 мая',  is_available: true,  slots_count: 4, times: ['08:00', '09:00', '10:00', '11:00'] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['18:00', '19:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-27', label: '27 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-28', label: '28 мая',  is_available: true,  slots_count: 3, times: ['10:00', '11:00', '12:00'] },
      { date: '2026-05-29', label: '29 мая',  is_available: true,  slots_count: 3, times: ['13:00', '14:00', '15:00'] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 3, times: ['16:00', '17:00', '18:00'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 3, times: ['09:00', '10:00', '11:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 3, times: ['12:00', '13:00', '14:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 2, times: ['10:00', '11:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 2, times: ['12:00', '13:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 2, times: ['14:00', '15:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: true,  slots_count: 2, times: ['16:00', '17:00'] },
      { date: '2026-06-08', label: '8 июн',   is_available: true,  slots_count: 2, times: ['18:00', '19:00'] },
      { date: '2026-06-09', label: '9 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-10', label: '10 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 1, times: ['08:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: true,  slots_count: 1, times: ['09:00'] },
      { date: '2026-06-13', label: '13 июн',  is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 1, times: ['11:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 1, times: ['12:00'] },
    ],
  },

  2: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: true,  slots_count: 2, times: ['12:00', '08:00'] },
      { date: '2026-05-18', label: '18 мая',  is_available: true,  slots_count: 4, times: ['10:00', '11:00', '14:00', '15:00'] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 3, times: ['09:00', '10:30', '12:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 2, times: ['14:00', '15:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: true,  slots_count: 3, times: ['08:00', '09:00', '11:00'] },
      { date: '2026-05-24', label: '24 мая',  is_available: true,  slots_count: 5, times: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['10:00', '11:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-27', label: '27 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-28', label: '28 мая',  is_available: true,  slots_count: 3, times: ['09:00', '10:00', '11:00'] },
      { date: '2026-05-29', label: '29 мая',  is_available: true,  slots_count: 4, times: ['12:00', '13:00', '14:00', '15:00'] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 2, times: ['08:00', '09:30'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 3, times: ['16:00', '17:00', '18:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 4, times: ['10:00', '11:00', '12:00', '13:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 3, times: ['09:00', '10:00', '11:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 3, times: ['14:00', '15:00', '16:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 2, times: ['12:00', '13:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: true,  slots_count: 2, times: ['08:00', '09:00'] },
      { date: '2026-06-08', label: '8 июн',   is_available: true,  slots_count: 5, times: ['15:00', '16:00', '17:00', '18:00', '19:00'] },
      { date: '2026-06-09', label: '9 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-10', label: '10 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 2, times: ['10:00', '11:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: true,  slots_count: 2, times: ['12:00', '13:00'] },
      { date: '2026-06-13', label: '13 июн',  is_available: true,  slots_count: 2, times: ['14:00', '15:00'] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 1, times: ['16:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 1, times: ['17:00'] },
    ],
  },

  3: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: true,  slots_count: 3, times: ['12:00', '08:00', '08:30'] },
      { date: '2026-05-18', label: '18 мая',  is_available: true,  slots_count: 1, times: ['09:00'] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 4, times: ['08:00', '09:00', '10:00', '11:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 4, times: ['12:00', '13:00', '14:00', '15:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: true,  slots_count: 3, times: ['16:00', '17:00', '18:00'] },
      { date: '2026-05-24', label: '24 мая',  is_available: true,  slots_count: 2, times: ['10:00', '11:00'] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['08:00', '09:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-27', label: '27 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-28', label: '28 мая',  is_available: true,  slots_count: 3, times: ['13:00', '14:00', '15:00'] },
      { date: '2026-05-29', label: '29 мая',  is_available: true,  slots_count: 3, times: ['16:00', '17:00', '18:00'] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 3, times: ['08:00', '09:00', '10:00'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 2, times: ['11:00', '12:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 2, times: ['14:00', '15:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 1, times: ['11:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 1, times: ['12:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: true,  slots_count: 1, times: ['13:00'] },
      { date: '2026-06-08', label: '8 июн',   is_available: true,  slots_count: 1, times: ['14:00'] },
      { date: '2026-06-09', label: '9 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-10', label: '10 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 2, times: ['09:00', '10:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: true,  slots_count: 2, times: ['11:00', '12:00'] },
      { date: '2026-06-13', label: '13 июн',  is_available: true,  slots_count: 2, times: ['13:00', '14:00'] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 2, times: ['15:00', '16:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 2, times: ['17:00', '18:00'] },
    ],
  },

  4: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-18', label: '18 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: true,  slots_count: 3, times: ['12:00', '14:00', '16:00'] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 2, times: ['10:00', '11:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 2, times: ['13:00', '15:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-24', label: '24 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['09:00', '10:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: true,  slots_count: 2, times: ['11:00', '12:00'] },
      { date: '2026-05-27', label: '27 мая',  is_available: true,  slots_count: 1, times: ['14:00'] },
      { date: '2026-05-28', label: '28 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-29', label: '29 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 2, times: ['10:00', '13:00'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 1, times: ['15:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 2, times: ['09:00', '11:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 1, times: ['12:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 1, times: ['14:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 1, times: ['16:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-08', label: '8 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-09', label: '9 июн',   is_available: true,  slots_count: 2, times: ['09:00', '10:00'] },
      { date: '2026-06-10', label: '10 июн',  is_available: true,  slots_count: 2, times: ['11:00', '12:00'] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 2, times: ['13:00', '14:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-13', label: '13 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 1, times: ['11:00'] },
    ],
  },

  5: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-18', label: '18 мая',  is_available: true,  slots_count: 3, times: ['12:00', '14:00', '16:00'] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 2, times: ['10:00', '12:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 2, times: ['14:00', '16:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-24', label: '24 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['11:00', '13:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: true,  slots_count: 1, times: ['15:00'] },
      { date: '2026-05-27', label: '27 мая',  is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-05-28', label: '28 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-29', label: '29 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 2, times: ['12:00', '14:00'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 2, times: ['16:00', '18:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 1, times: ['11:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 2, times: ['10:00', '12:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 2, times: ['14:00', '16:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 1, times: ['11:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-08', label: '8 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-09', label: '9 июн',   is_available: true,  slots_count: 2, times: ['13:00', '15:00'] },
      { date: '2026-06-10', label: '10 июн',  is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 1, times: ['12:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-13', label: '13 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 2, times: ['11:00', '14:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 1, times: ['16:00'] },
    ],
  },

  6: {
    data: [
      { date: '2026-05-17', label: 'Сегодня', is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-18', label: '18 мая',  is_available: true,  slots_count: 2, times: ['12:00', '08:00'] },
      { date: '2026-05-19', label: '19 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-20', label: '20 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-21', label: '21 мая',  is_available: true,  slots_count: 3, times: ['09:00', '11:00', '14:00'] },
      { date: '2026-05-22', label: '22 мая',  is_available: true,  slots_count: 2, times: ['10:00', '13:00'] },
      { date: '2026-05-23', label: '23 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-24', label: '24 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-25', label: '25 мая',  is_available: true,  slots_count: 2, times: ['08:00', '10:00'] },
      { date: '2026-05-26', label: '26 мая',  is_available: true,  slots_count: 1, times: ['12:00'] },
      { date: '2026-05-27', label: '27 мая',  is_available: true,  slots_count: 1, times: ['14:00'] },
      { date: '2026-05-28', label: '28 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-29', label: '29 мая',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-05-30', label: '30 мая',  is_available: true,  slots_count: 2, times: ['09:00', '11:00'] },
      { date: '2026-05-31', label: '31 мая',  is_available: true,  slots_count: 2, times: ['13:00', '15:00'] },
      { date: '2026-06-01', label: '1 июн',   is_available: true,  slots_count: 2, times: ['08:00', '10:00'] },
      { date: '2026-06-02', label: '2 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-03', label: '3 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-04', label: '4 июн',   is_available: true,  slots_count: 1, times: ['11:00'] },
      { date: '2026-06-05', label: '5 июн',   is_available: true,  slots_count: 1, times: ['13:00'] },
      { date: '2026-06-06', label: '6 июн',   is_available: true,  slots_count: 1, times: ['15:00'] },
      { date: '2026-06-07', label: '7 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-08', label: '8 июн',   is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-09', label: '9 июн',   is_available: true,  slots_count: 2, times: ['09:00', '12:00'] },
      { date: '2026-06-10', label: '10 июн',  is_available: true,  slots_count: 2, times: ['14:00', '16:00'] },
      { date: '2026-06-11', label: '11 июн',  is_available: true,  slots_count: 1, times: ['10:00'] },
      { date: '2026-06-12', label: '12 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-13', label: '13 июн',  is_available: false, slots_count: 0, times: [] },
      { date: '2026-06-14', label: '14 июн',  is_available: true,  slots_count: 2, times: ['09:00', '11:00'] },
      { date: '2026-06-15', label: '15 июн',  is_available: true,  slots_count: 1, times: ['13:00'] },
    ],
  },
};
