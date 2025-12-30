# MedusaJS (headless commerce) — план підключення

Цей проєкт — Vite SPA. Medusa — це окремий **backend** (і окрема адмінка), яку ми можемо підняти як сервіс і під’єднати магазин до API.

## Варіант A (рекомендовано): окремий Medusa backend + адмінка

1) Створити Medusa backend (найпростіше через офіційний starter/CLI):

- В окремій теці (наприклад `medusa-backend/`) створюємо проєкт Medusa.
- Підключаємо Postgres.
- Запускаємо admin.

2) У фронтенді `Kalaur-auto` замінюємо джерело каталогу:

- Замість `src/data/shopProducts.ts` → читати `products` з Medusa Store API.
- Кошик залишаємо у фронтенді, а checkout інтегруємо через Medusa (або залишаємо Stripe Checkout як зараз — залежить від вимог).

## Що саме треба уточнити (2 питання)

1) Medusa має **повністю замінити** поточний магазин/адмінку (товари, склади, категорії), чи поки що просто підняти backend “на майбутнє”?
2) Оплату залишаємо як зараз через **Stripe Checkout** (наш `/api/create-checkout-session`), чи переносимо оплату в Medusa (Stripe payment integration у Medusa)?

## Примітка

Посилання, яке ви дали (https://github.com/medusajs/medusa.git) — це монорепозиторій, клонувати його в цей сайт не потрібно для інтеграції. Правильний шлях — створити окремий Medusa backend-проєкт і підключити фронтенд по HTTP.
