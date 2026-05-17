# Техническое Задание — Backend API для MamaDoc Booking

**Версия:** 1.0  
**Дата:** 2026-05-17  
**Кому:** Backend Developer  
**Проект:** MamaDoc — платформа для записи к врачам (г. Бишкек, Кыргызстан)

---

## 1. Общее описание задачи

Фронтенд приложения уже готов. Он работает на мок-данных (захардкоженные массивы в TypeScript). Твоя задача — написать REST API, который заменит эти мок-данные реальными данными из базы, а также реализует логику OTP-авторизации и сохранения записи к врачу.

Фронтенд написан на Next.js. После того как API будет готово, мы подключим его и начнём тестирование.

---

## 2. Рекомендуемый стек

| Слой | Технология |
|------|-----------|
| Язык | Python 3.11+ |
| Фреймворк | FastAPI |
| БД | PostgreSQL 15+ |
| ORM | SQLAlchemy 2.x + Alembic (миграции) |
| Аутентификация | JWT (access token) + OTP через SMS |
| SMS-провайдер | Любой доступный в KG (например, Nikita, SMSC, или тестово через Twilio) |
| Документация | Swagger UI (встроен в FastAPI, `/docs`) |
| Переменные окружения | python-dotenv |
| Контейнеризация | Docker + docker-compose |

> **Если не знаком с FastAPI** — можно использовать Django REST Framework. Главное — чтобы была автодокументация (Swagger/OpenAPI).

---

## 3. База данных — Схема таблиц

### 3.1 `specialists` — Специализации

```sql
CREATE TABLE specialists (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,        -- "Гинеколог", "Кардиолог"
    slug        VARCHAR(100) UNIQUE NOT NULL, -- "gynecologist", "cardiologist"
    description TEXT,                         -- краткое описание специализации
    icon_url    VARCHAR(255),                 -- ссылка на иконку
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,            -- порядок отображения в списке
    created_at  TIMESTAMP DEFAULT NOW()
);
```

> **Сейчас на фронте:** 19 специализаций захардкожены с картинками. После подключения API список будет браться отсюда.

---

### 3.2 `doctors` — Врачи

```sql
CREATE TABLE doctors (
    id                  SERIAL PRIMARY KEY,
    full_name           VARCHAR(200) NOT NULL,
    photo_url           VARCHAR(255),
    specialist_id       INTEGER REFERENCES specialists(id),
    rating              DECIMAL(2,1) DEFAULT 0.0,  -- 4.8
    rating_count        INTEGER DEFAULT 0,           -- кол-во оценок
    experience_years    INTEGER NOT NULL,
    bio                 TEXT,                        -- краткая биография
    education           TEXT,                        -- образование

    -- Контактная информация
    clinic_address      VARCHAR(255),                -- "Орозбекова 112, Бишкек"
    clinic_name         VARCHAR(200),                -- название клиники
    phone_admin         VARCHAR(20),                 -- телефон для внутреннего использования

    -- Настройки записи
    slot_duration_min   INTEGER DEFAULT 30,          -- длительность приёма в минутах
    consultation_type   VARCHAR(20) DEFAULT 'offline', -- 'offline', 'online', 'both'
    gender              VARCHAR(10),                 -- 'male', 'female'
    languages           VARCHAR(100) DEFAULT 'ru',  -- "ru,kg,en"

    is_active           BOOLEAN DEFAULT TRUE,
    is_accepting_new    BOOLEAN DEFAULT TRUE,        -- принимает ли новых пациентов
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);
```

---

### 3.3 `doctor_specialties` — Врач может иметь несколько специализаций

```sql
CREATE TABLE doctor_specialties (
    id            SERIAL PRIMARY KEY,
    doctor_id     INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    specialist_id INTEGER REFERENCES specialists(id),
    is_primary    BOOLEAN DEFAULT FALSE   -- основная специализация
);
```

---

### 3.4 `services` — Услуги врача

```sql
CREATE TABLE services (
    id          SERIAL PRIMARY KEY,
    doctor_id   INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,    -- "Общий осмотр"
    price       INTEGER NOT NULL,         -- цена в сомах (KGS)
    duration_min INTEGER DEFAULT 30,     -- длительность услуги
    description TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0
);
```

---

### 3.5 `doctor_schedule` — Шаблон рабочих часов врача

Это шаблон по дням недели (не конкретные даты).

```sql
CREATE TABLE doctor_schedule (
    id          SERIAL PRIMARY KEY,
    doctor_id   INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,          -- 0=Пн, 1=Вт, ..., 6=Вс
    start_time  TIME NOT NULL,             -- "09:00"
    end_time    TIME NOT NULL,             -- "18:00"
    break_start TIME,                      -- "13:00"
    break_end   TIME,                      -- "14:00"
    is_working  BOOLEAN DEFAULT TRUE
);
```

---

### 3.6 `schedule_exceptions` — Исключения (отпуск, выходной)

```sql
CREATE TABLE schedule_exceptions (
    id          SERIAL PRIMARY KEY,
    doctor_id   INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    is_day_off  BOOLEAN DEFAULT TRUE,      -- TRUE = выходной день
    reason      VARCHAR(200)               -- "Отпуск", "Больничный"
);
```

---

### 3.7 `patients` — Пациенты (регистрируются через телефон)

```sql
CREATE TABLE patients (
    id         SERIAL PRIMARY KEY,
    phone      VARCHAR(20) UNIQUE NOT NULL, -- "+996700123456"
    full_name  VARCHAR(200),                -- заполняется пациентом после регистрации
    birth_date DATE,
    gender     VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    last_seen  TIMESTAMP DEFAULT NOW()
);
```

---

### 3.8 `otp_codes` — OTP коды для верификации

```sql
CREATE TABLE otp_codes (
    id          SERIAL PRIMARY KEY,
    phone       VARCHAR(20) NOT NULL,
    code        VARCHAR(6) NOT NULL,
    expires_at  TIMESTAMP NOT NULL,         -- NOW() + 60 seconds
    is_used     BOOLEAN DEFAULT FALSE,
    attempts    INTEGER DEFAULT 0,          -- кол-во неверных попыток
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

### 3.9 `bookings` — Записи к врачу

```sql
CREATE TABLE bookings (
    id               SERIAL PRIMARY KEY,
    patient_id       INTEGER REFERENCES patients(id),
    doctor_id        INTEGER REFERENCES doctors(id),
    booking_date     DATE NOT NULL,
    booking_time     TIME NOT NULL,
    status           VARCHAR(20) DEFAULT 'pending',
                     -- 'pending', 'confirmed', 'cancelled', 'completed', 'no_show'
    confirmation_code  VARCHAR(10),          -- "TG76789" — показывается в Success Modal
    total_price        INTEGER,             -- сумма всех выбранных услуг
    total_duration_min INTEGER NOT NULL,    -- сумма duration_min всех услуг; используется для блокировки слотов

    -- Причина отмены
    cancellation_reason VARCHAR(255),
    cancelled_by     VARCHAR(20),           -- 'patient', 'doctor', 'admin'

    -- Уведомления
    reminder_sent    BOOLEAN DEFAULT FALSE,

    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);
```

---

### 3.10 `booking_services` — Какие услуги выбраны в записи

```sql
CREATE TABLE booking_services (
    id         SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    price      INTEGER NOT NULL             -- фиксируем цену на момент записи
);
```

---

### 3.11 `reviews` — Отзывы пациентов

```sql
CREATE TABLE reviews (
    id           SERIAL PRIMARY KEY,
    doctor_id    INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id   INTEGER REFERENCES patients(id),
    booking_id   INTEGER REFERENCES bookings(id),  -- отзыв только по реальной записи
    rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text         TEXT,
    is_approved  BOOLEAN DEFAULT FALSE,             -- модерация перед публикацией
    created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 4. REST API Эндпоинты

**Базовый URL:** `https://api.mamadoc.kg/v1`  
**Формат:** JSON  
**Кодировка:** UTF-8

---

### 4.1 Специализации

#### `GET /specialists`
Список всех специализаций для главной страницы.

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Гинеколог",
      "slug": "gynecologist",
      "icon_url": "https://cdn.mamadoc.kg/icons/gynecologist.svg",
      "description": "Специалист по женскому здоровью"
    }
  ]
}
```

---

### 4.2 Врачи

#### `GET /doctors`
Список врачей с ближайшими доступными слотами (для карточек на главной).

**Query parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `specialist_id` | integer | фильтр по специализации |
| `search` | string | поиск по имени врача |
| `page` | integer | пагинация (default: 1) |
| `limit` | integer | кол-во на странице (default: 10, max: 50) |

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "full_name": "Сурапбеков Бекмамат Султангазиевич",
      "photo_url": "https://cdn.mamadoc.kg/photos/doctor1.jpg",
      "specialty": "Гинеколог",
      "rating": 4.8,
      "experience_years": 12,
      "availability": {
        "label": "Сегодня",
        "slots": ["09:00", "11:30", "14:00"],
        "more_count": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47
  }
}
```

> **Логика `availability`:** Берётся ближайший день, когда есть свободные слоты. `label` — "Сегодня", "Завтра" или дата ("13 мар"). `slots` — первые 3 слота. `more_count` — остаток.

---

#### `GET /doctors/{id}`
Полная информация о враче для страницы записи.

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "full_name": "Сурапбеков Бекмамат Султангазиевич",
    "photo_url": "https://cdn.mamadoc.kg/photos/doctor1.jpg",
    "specialties": ["Гинеколог", "Гинеколог-эндокринолог"],
    "rating": 4.8,
    "rating_count": 127,
    "experience_years": 12,
    "bio": "Опытный специалист с 12-летним стажем...",
    "clinic_name": "МедЦентр Плюс",
    "clinic_address": "Орозбекова 112, Бишкек",
    "consultation_type": "offline",
    "languages": ["ru", "kg"],
    "is_accepting_new": true,
    "services": [
      {
        "id": 1,
        "name": "Общий осмотр",
        "price": 1500,
        "duration_min": 30
      }
    ],
    "reviews": {
      "total_count": 127,
      "items": [
        {
          "id": 1,
          "patient_name": "Айгуль М.",
          "rating": 5,
          "text": "Очень внимательный врач...",
          "date": "2026-03-15"
        }
      ]
    }
  }
}
```

---

#### `GET /doctors/{id}/calendar`
Расписание врача на 30 дней вперёд (доступные даты и слоты).

**Response 200:**
```json
{
  "data": [
    {
      "date": "2026-05-17",
      "label": "Сегодня",
      "is_available": true,
      "slots_count": 8,
      "times": ["09:00", "09:30", "11:00", "14:00", "15:30"]
    },
    {
      "date": "2026-05-18",
      "label": "18 мая",
      "is_available": false,
      "slots_count": 0,
      "times": []
    }
  ]
}
```

> **Логика генерации слотов:**  
> 1. Берём шаблон `doctor_schedule` для этого дня недели  
> 2. Вычитаем занятые слоты из `bookings` (где `status != 'cancelled'`)  
> 3. Вычитаем исключения из `schedule_exceptions`  
> 4. Возвращаем только свободные слоты

---

### 4.3 OTP Авторизация

#### `POST /auth/send-otp`
Отправить OTP код на телефон.

**Request:**
```json
{
  "phone": "+996700123456"
}
```

**Response 200:**
```json
{
  "message": "Код отправлен",
  "expires_in": 60
}
```

**Response 429 (слишком много запросов):**
```json
{
  "error": "too_many_requests",
  "message": "Подождите 60 секунд перед повторной отправкой",
  "retry_after": 45
}
```

> **Правила:**  
> - Один код действует 60 секунд  
> - Максимум 5 попыток ввода кода, затем блокировка на 5 минут  
> - Максимум 3 отправки кода в час на один номер  
> - В режиме разработки можно возвращать код в ответе (только dev-окружение!)

---

#### `POST /auth/verify-otp`
Верифицировать OTP код и получить токен.

**Request:**
```json
{
  "phone": "+996700123456",
  "code": "123456"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "is_new_patient": true
}
```

**Response 400:**
```json
{
  "error": "invalid_code",
  "message": "Неверный код",
  "attempts_left": 3
}
```

---

### 4.4 Записи (Bookings)

> **Все запросы ниже требуют авторизации.**  
> Header: `Authorization: Bearer <access_token>`

#### `POST /bookings`
Создать запись к врачу.

**Request:**
```json
{
  "doctor_id": 1,
  "date": "2026-05-20",
  "time": "09:30",
  "service_ids": [1, 3]
}
```

**Response 201:**
```json
{
  "data": {
    "id": 42,
    "confirmation_code": "TG76789",
    "doctor": {
      "full_name": "Сурапбеков Бекмамат Султангазиевич",
      "photo_url": "https://cdn.mamadoc.kg/photos/doctor1.jpg",
      "specialty": "Гинеколог",
      "clinic_address": "Орозбекова 112, Бишкек"
    },
    "date": "2026-05-20",
    "time": "09:30",
    "services": [
      {"name": "Общий осмотр", "price": 1500},
      {"name": "Сдача анализов", "price": 1500}
    ],
    "total_price": 3000,
    "status": "confirmed"
  }
}
```

**Response 409 (слот занят):**
```json
{
  "error": "slot_unavailable",
  "message": "Выбранное время уже занято. Пожалуйста, выберите другое время."
}
```

---

#### `GET /bookings/my`
Список записей текущего пациента.

**Response 200:**
```json
{
  "data": [
    {
      "id": 42,
      "confirmation_code": "TG76789",
      "doctor_name": "Сурапбеков Бекмамат Султангазиевич",
      "date": "2026-05-20",
      "time": "09:30",
      "status": "confirmed",
      "total_price": 3000
    }
  ]
}
```

---

#### `DELETE /bookings/{id}`
Отменить запись (пациент может отменить за 2+ часа до приёма).

**Response 200:**
```json
{
  "message": "Запись отменена"
}
```

**Response 400:**
```json
{
  "error": "cannot_cancel",
  "message": "Отменить запись можно не позднее чем за 2 часа до приёма"
}
```

---

### 4.5 Отзывы

#### `GET /doctors/{id}/reviews`
Постраничные отзывы о враче.

**Query:** `?page=1&limit=5`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "patient_name": "Айгуль М.",
      "rating": 5,
      "text": "Очень внимательный врач!",
      "date": "2026-03-15"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 127
  }
}
```

---

#### `POST /doctors/{id}/reviews`
Оставить отзыв (только авторизованные, только после реальной записи).

**Request:**
```json
{
  "booking_id": 42,
  "rating": 5,
  "text": "Отличный специалист!"
}
```

**Response 201:**
```json
{
  "message": "Отзыв отправлен на модерацию"
}
```

---

## 5. Форматы и правила

### 5.1 Телефон
- Принимать в формате: `+996XXXXXXXXX` (Кыргызстан), `+7XXXXXXXXXX` (Россия/Казахстан)
- Хранить в БД с `+` и кодом страны
- Валидировать длину в зависимости от кода страны

### 5.2 Дата и время
- Дата: ISO 8601 формат `YYYY-MM-DD`
- Время: `HH:MM` (24-часовой формат)
- Часовой пояс: UTC+6 (Бишкек). Хранить в UTC, конвертировать при выдаче.

### 5.3 Код подтверждения (confirmation_code)
- Формат: `TG` + 5 случайных цифр (например, `TG76789`)
- Генерируется уникально при создании записи

### 5.4 Коды ошибок
Все ошибки возвращать в едином формате:
```json
{
  "error": "snake_case_error_code",
  "message": "Человекочитаемый текст на русском",
  "details": {}
}
```

| HTTP код | Когда использовать |
|----------|-------------------|
| 200 | Успех (GET, DELETE) |
| 201 | Создан (POST) |
| 400 | Невалидные данные |
| 401 | Не авторизован |
| 403 | Нет доступа |
| 404 | Не найдено |
| 409 | Конфликт (слот занят) |
| 429 | Слишком много запросов |
| 500 | Ошибка сервера |

---

## 6. Начальные данные (Seed Data)

Необходимо заполнить БД начальными данными для тестирования:

- **19 специализаций** (список есть на фронте: Акушер, Аллерголог, Анестезиолог и т.д.)
- **5 врачей** с расписанием (минимум 2 рабочих дня в неделю)
- **По 3-7 услуг** на каждого врача
- **По 5-10 отзывов** для каждого врача
- **Тестовый номер** для OTP: `+996700000000` — код всегда `123456`

---

## 7. Что НЕ предусмотрено на фронте — рекомендую добавить

> Это поля/логика, которых нет в текущем UI, но они нужны для реального приложения.

### 7.1 В `doctors` добавить:
- `consultation_type` — онлайн/офлайн/оба формата. Сейчас нет нигде, но пациенты явно захотят.
- `languages` — "ru", "kg" — в Кыргызстане это важно.
- `education` и `bio` — сейчас страница врача пустая в этом плане.
- `is_accepting_new` — флаг "не принимает новых пациентов" — без этого нельзя скрыть кнопку записи.

### 7.2 В `services` добавить:
- `duration_min` — сейчас все услуги по 30 минут по умолчанию, но "Лечение бесплодия" и "Общий осмотр" — разные по времени. Без этого поля нельзя корректно генерировать слоты.

### 7.3 В `bookings` добавить:
- `status` с жизненным циклом: `pending → confirmed → completed / cancelled / no_show`. Без статусов невозможно строить аналитику и историю.
- `cancellation_reason` — минимально нужен для отчётности.
- `reminder_sent` — в будущем для SMS-напоминаний за день до приёма.

### 7.4 В `reviews` добавить:
- `booking_id` (обязательный) — отзыв должен быть привязан к реальной записи, иначе любой сможет писать фейки.
- `is_approved` — модерация перед публикацией.

### 7.5 Чего не хватает в логике расписания:
Сейчас на фронте показывается 30 дней с захардкоженными слотами. При реальной реализации нужен механизм генерации слотов:
- Берётся шаблон (doctor_schedule) → генерируются все слоты
- Из них вычитаются занятые (bookings)
- Результат кэшируется на несколько минут, чтобы не считать на каждый запрос

### 7.6 Чего нет нигде (стоит обсудить с командой):
- Онлайн-оплата — в SuccessModal нет платёжной информации, но без оплаты приложение работает как справочник, а не как booking-платформа.
- Push/SMS-напоминания — "Ваша запись завтра в 09:30".
- Повторная запись — кнопка "Записаться снова к этому врачу".
- Рейтинг пересчёт — при добавлении нового отзыва автоматически обновлять `doctors.rating` и `rating_count`.

---

## 8. Порядок выполнения (для джуниора)

Делай в следующем порядке, не пытайся всё сразу:

1. **[День 1-2]** Инициализировать проект (FastAPI + PostgreSQL + Docker). Настроить Swagger.
2. **[День 3]** Создать все таблицы через Alembic миграции. Заполнить seed-данными.
3. **[День 4]** Реализовать `GET /specialists` и `GET /doctors` (без авторизации).
4. **[День 5]** Реализовать `GET /doctors/{id}` и `GET /doctors/{id}/calendar`.
5. **[День 6-7]** OTP: `POST /auth/send-otp` + `POST /auth/verify-otp` + JWT токен.
6. **[День 8]** `POST /bookings` (с проверкой свободного слота).
7. **[День 9]** `GET /bookings/my`, `DELETE /bookings/{id}`.
8. **[День 10]** `GET /doctors/{id}/reviews`, `POST /doctors/{id}/reviews`.
9. **[День 11]** Тестирование через Swagger, отладка крайних случаев.
10. **[День 12]** Документация `.env.example`, README с инструкцией запуска.

---

## 9. Чек-лист сдачи

Перед тем как сказать "готово", убедись что:

- [ ] Swagger доступен по `/docs` и все эндпоинты задокументированы
- [ ] Все таблицы созданы через Alembic (не руками!)
- [ ] Seed-данные добавляются одной командой (`python seed.py`)
- [ ] Тестовый OTP `+996700000000` → `123456` работает
- [ ] `GET /doctors/{id}/calendar` возвращает корректные свободные слоты
- [ ] Занятый слот возвращает 409 при попытке записаться повторно
- [ ] Все даты в UTC, в ответе конвертированы в UTC+6
- [ ] Файл `.env.example` заполнен (без реальных секретов)
- [ ] `docker-compose up` поднимает весь проект с нуля

---

## 10. Переменные окружения (`.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mamadoc
JWT_SECRET=your-secret-key-here
JWT_EXPIRE_MINUTES=10080

SMS_PROVIDER_URL=
SMS_PROVIDER_TOKEN=

OTP_EXPIRE_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN=60

DEV_OTP_BYPASS=true         # только для разработки!
DEV_OTP_PHONE=+996700000000
DEV_OTP_CODE=123456

CORS_ORIGINS=http://localhost:3000
```

---

*По всем вопросам — пиши в чат. Удачи!*
