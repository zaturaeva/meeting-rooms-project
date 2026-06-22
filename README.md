## Быстрый старт

### 1. Слонировать репозиторий
```bash
git clone https://github.com/zaturaeva/meeting-rooms-project.git
cd meeting-rooms-project
```

### 2. Настройка бэкенда
```bash
cd booking-backend
npm install
npm run start:dev
```
Бэкенд запустится на `http://localhost:3000`

### 3. Настройка фронтенда
```bash
cd ../booking-frontend
npm install
npm run dev
```
Фронтенд запустится на `http://localhost:5173`


## Структура проекта

```
meeting-rooms-project/
├── booking-backend/          # Backend (NestJS + TypeORM)
│   ├── src/
│   │   ├── bookings/         # Модуль бронирований
│   │   ├── rooms/            # Модуль комнат
│   │   └── app.module.ts     # Главный модуль
│   └── package.json
├── booking-frontend/         # Frontend (Vue 3 + Vite)
│   ├── src/
│   │   ├── components/       # Vue-компоненты
│   │   ├── types/            # TypeScript интерфейсы
│   │   └── App.vue
│   └── package.json
└── README.md
```

## Основной функционал

- Список переговорных комнат – просмотр всех доступных комнат
- Создание бронирования – выбор комнаты, даты и времени
- Проверка занятости – нельзя бронировать занятое время
- Удаление бронирования – отмена существующей записи
- Валидация – серверная и клиентская проверка данных

## Технологии

- **Frontend** - Vue 3, Composition API, TypeScript, Axios, Vite
- **Backend** - NestJS, TypeORM, SQLite, class-validator 
- **База данных** - SQLite (можно заменить на PostgreSQL) 

## Команды для разработки

- `npm run start:dev` - Запуск бэкенда в режиме разработки
-  `npm run dev` - Запуск фронтенда в режиме разработки
-   `npm run build` - Сборка проекта для продакшена
-    `npm run test` - Запуск тестов 

## API Эндпоинты

- `GET` - `/rooms` - Получить список всех комнат 
- `GET` - `/bookings` - Получить список всех бронирований 
- `POST` - `/bookings` - Создать новое бронирование 
- `DELETE` - `/bookings/:id` - Удалить бронирование по ID 

## Авторы

- [zaturaeva](https://github.com/zaturaeva)
- [rrrrr613](https://github.com/rrrrr613)
- [ortasyan-droid](https://github.com/ortasyan-droid)  

git push origin feature/booking-system
```

---

Готово! Теперь на GitHub у проекта будет красивое описание. 🚀
