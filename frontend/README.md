# Serwis IT — Frontend (HTML, CSS, JavaScript)

Этот Frontend адаптирован **по HTML-экспорту UXPin из 7 экранов** и карте проекта *Serwis IT – System zarządzania zgłoszeniami serwisowymi*. Вместо тяжёлого UXPin Preview подготовлены редактируемые HTML, CSS и vanilla JavaScript. Реализация повторяет основные тексты, палитру, компоненты и расположение секций исходных макетов, но **не является пиксель-в-пиксель экспортом**: адаптивность, таблицы и интерактивность написаны отдельно.

## Как открыть в VS Code

1. Распакуй архив в каталог `project/` — он содержит папку `frontend/`.
2. Открой папку `project/` в VS Code.
3. Установи расширение **Live Server** (если его нет).
4. Открой `frontend/index.html` → правой кнопкой → **Open with Live Server**.
5. Нажми **Get Started** → Registration → Sign In.

Альтернативный запуск:

```bash
cd frontend
python -m http.server 5500
```

Открой `http://localhost:5500`. Не запускай через `file://`: JS ES modules могут блокироваться браузером без сервера.

**Устанавливать npm, Vite, React или TypeScript не нужно.**

## Тестовые аккаунты (только для демо)

В Login есть кнопки для автоматического заполнения. Пароль для всех — `demo12345`.

| Роль | Почта |
| --- | --- |
| Customer | `customer@demo.test` |
| Technician | `technician@demo.test` |
| Administrator | `admin@demo.test` |

Новые аккаунты регистрируются только с ролью Customer. Заявки и изменённые статусы сохраняются в `localStorage` в твоём браузере. Для сброса тестовых данных можно очистить данные сайта.

**Ограничение безопасности:** всё содержимое `localStorage` и проверка ролей в этом проекте — только демонстрация. В реальном приложении нельзя хранить пароли в localStorage или доверять Frontend-проверке прав. Авторизация, хранение паролей и права доступа должны реализовываться на Spring Boot Backend.

## Страницы и UXPin-экраны

| UXPin | Рабочий HTML |
| --- | --- |
| `main` | `index.html` |
| `registr` | `pages/register.html` |
| `login` | `pages/login.html` |
| `customer` | `pages/client.html` |
| `technician` | `pages/technician.html` |
| `admin` | `pages/admin.html` и `pages/users.html` |
| `request` | `pages/new-request.html` |

Дополнительно есть `requests.html`, `history.html`, `request-details.html` для полноценных переходов.

## Папки

```text
frontend/
├── index.html
├── pages/
│   ├── register.html
│   ├── login.html
│   ├── client.html
│   ├── technician.html
│   ├── admin.html
│   ├── new-request.html
│   ├── requests.html
│   ├── history.html
│   ├── request-details.html
│   └── users.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── api.js
│   └── mockData.js
├── README.md
└── UXPin_MAPPING.md
```

`js/main.js` — рендер интерфейса, меню, фильтры, формы и переходы. `css/styles.css` — единые стили и светлая/тёмная тема. `js/mockData.js` — демонстрационные данные. `js/api.js` — единая точка интеграции для Backend.

## Что работает без Backend

- Публичная главная, переход только к регистрации, прокрутка к How It Works, раскрывающийся FAQ.
- Светлая и тёмная темы с сохранением предпочтения в браузере.
- Регистрация и логин с проверкой заполнения полей.
- Демонстрационный вход в три роли.
- Customer: просмотр своих заявок, новая заявка, история, подробности, статусы.
- Technician: общий список и изменение статуса заявки (также прямо с Dashboard).
- Administrator: обзор всех заявок, поиск и фильтрация, просмотр пользователей.
- Адаптивная вёрстка: компьютер, планшет и телефон.

## Подключение Spring Boot REST API

1. Согласуйте с Backend разработчиками URL endpoints, DTO/JSON форматы, регистрацию/логин, авторизацию, CORS, коды ошибок и права ролей.
2. Реализуй методы `api` в `js/api.js` через `fetch()` вместо текущих mock-функций.
3. Не переводи `USE_MOCK` в `false`, пока не написана реальная интеграция: сейчас вызов честно выдаст ошибку о том, что Backend не подключён.
4. Настрой серверную авторизацию: Backend должен самостоятельно проверять право пользователя читать чужие заявки и менять статусы.
5. Удали демо-пароли, демо-аккаунты, локальное сохранение секретов и тестовые данные перед реальным развертыванием.

В текущем проекте **нет реального Backend**. Форма и смена статусов работают только с демо-данными.

## Проверка

Проверены:
- синтаксис JS через `node --check`;
- генерация HTML для `home`, `register`, `login`, `client`, `technician`, `admin`, `new-request`, `requests`, `history`, `users` в тестовой DOM-заглушке;
- наличие пользовательских элементов каждой роли.

Полный визуальный и end-to-end тест в реальном браузере не проводился. Перед сдачей открой страницы через Live Server и проверь сценарии вручную.
