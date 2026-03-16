// Импорты всех изображений
import Akusher from './akusher.png';
import Allergolog from './allergolog.png';
import Anastetika from './anastetika.png';
import Dentist from './dentist.png';
import Dermatolog from './dermatolog.png';
import Endokrinolog from './endokrinolog.png';
import Fizioterapeft from './fizioterapeft.png';
import Gastro from './gastro.png';
import Hirurg from './hirurg.png';
import Kardiolog from './kardiolog.png';
import Lor from './lor.png';
import Neirohirurg from './neirohirurg.png';
import Oftalmolog from './oftalmolog.png';
import Onkolog from './onkolog.png';
import Ortodont from './ortodont.png';
import Psihiatr from './psihiatr.png';
import Revmatolog from './revmatolog.png';
import Terapeft from './terapeft.png';
import Venerolog from './venerolog.png';

// 1. Объект-словарь для прямого доступа (например, SpecialistImages.Dentist)
export const SpecialistImages = {
  Akusher,
  Allergolog,
  Anesthesiology: Anastetika, // Поправил название ключа для логики
  Dentist,
  Dermatolog,
  Endokrinolog,
  Fizioterapeft,
  Gastro,
  Hirurg,
  Kardiolog,
  Lor,
  Neirohirurg,
  Oftalmolog,
  Onkolog,
  Ortodont,
  Psihiatr,
  Revmatolog,
  Terapeft,
  Venerolog,
} as const;

// 2. Массив объектов для маппинга в UI (например, для списка на главной)
export const SPECIALISTS_LIST = [
  { id: 1, title: 'Акушер', img: Akusher },
  { id: 2, title: 'Аллерголог', img: Allergolog },
  { id: 3, title: 'Анестезиолог', img: Anastetika },
  { id: 4, title: 'Стоматолог', img: Dentist },
  { id: 5, title: 'Дерматолог', img: Dermatolog },
  { id: 6, title: 'Эндокринолог', img: Endokrinolog },
  { id: 7, title: 'Физиотерапевт', img: Fizioterapeft },
  { id: 8, title: 'Гастроэнтеролог', img: Gastro },
  { id: 9, title: 'Хирург', img: Hirurg },
  { id: 10, title: 'Кардиолог', img: Kardiolog },
  { id: 11, title: 'ЛОР', img: Lor },
  { id: 12, title: 'Нейрохирург', img: Neirohirurg },
  { id: 13, title: 'Офтальмолог', img: Oftalmolog },
  { id: 14, title: 'Онколог', img: Onkolog },
  { id: 15, title: 'Ортодонт', img: Ortodont },
  { id: 16, title: 'Психиатр', img: Psihiatr },
  { id: 17, title: 'Ревматолог', img: Revmatolog },
  { id: 18, title: 'Терапевт', img: Terapeft },
  { id: 19, title: 'Венеролог', img: Venerolog },
];
