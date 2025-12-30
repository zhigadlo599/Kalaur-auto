# EcoClean

**Version 1.0.0**

EcoClean Pro is a modern web application that provides professional cleaning services. This application is designed to offer a seamless user experience for both residential and commercial clients, allowing them to easily book services, manage appointments, and get quotes. Built with a robust and modern technology stack, EcoClean Pro ensures reliability, scalability, and a user-friendly interface.

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Vite

## Installation

1. Clone the repository:
```bash
git clone <REPO_URL>
```

2. Install the dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Compiles the project for production
- `npm run preview`: Previews the production build
- `npm run lint`: Runs the linter

## Deploy to Vercel

This project is a Vite app and can be deployed to Vercel easily.

1. Option A — connect GitHub repo in Vercel dashboard:

  - Push your local repository to GitHub (see commands below).
  - In Vercel, Import Project → select your GitHub repo → Accept defaults (Build: `npm run build`, Output: `dist`).

2. Option B — use Vercel CLI:

```bash
npx vercel login
npx vercel --prod
```

Commands to push this repo to your GitHub (replace `<YOUR_GIT_URL>`):

```bash
git remote add origin <YOUR_GIT_URL>
git branch -M main
git add .
git commit -m "Prepare for Vercel deploy"
git push -u origin main
```

## Магазин + адмін (Kalaur-auto)

### 1) Де редагувати товари

Базовий каталог живе в `src/data/shopProducts.ts`, але керування з адмінки працює через localStorage (оверрайди):

- В адмінці можна змінювати `name`, `inStock`, `condition`.
- `priceUah` навмисно не редагується в адмінці, щоб оплата Stripe (serverless) залишалась коректною.

### 2) Як увійти в адмінку

У шапці сайту натисніть **Вхід/Адмін** та введіть логін/пароль (після входу можна перейти в `/admin`).

Важливо: для продакшену увімкнений server-side вхід через cookie-сесію (`/api/admin/login`) — так логін/пароль не зберігаються у фронтенд-коді. Для локальної розробки без Vercel Functions залишається fallback (SPA).

Змінні середовища для адмін-входу (на хостингу):

- `ADMIN_USERNAME` (default: `admi`)
- `ADMIN_PASSWORD` (default: `admin`)
- `ADMIN_SESSION_SECRET` (рекомендовано задати в production)

### 2.1) Постійне збереження змін в товарах (база)

Щоб керування товарами з адмінки працювало між різними пристроями/користувачами, оверрайди каталогу зберігаються в Vercel KV через `/api/catalog`.

Якщо KV не налаштований, сайт автоматично використовує fallback на `localStorage`.

Примітка: при підключенні Vercel KV потрібні KV env vars. На Vercel вони додаються автоматично після підключення KV до проєкту.

### 3) Оплата Visa/Mastercard

Оплата зроблена через Stripe Checkout (card). Для роботи на Vercel потрібно додати змінну середовища:

- `STRIPE_SECRET_KEY`

Після успішної оплати Stripe повертає на `/cart?success=1`.

## Про Vercel Commerce (vercel/commerce)

`vercel/commerce` — це окремий Next.js storefront, який за замовчуванням працює з Shopify (керування товарами — в адмінці Shopify). Якщо хочете перейти на Shopify + Vercel Commerce замість поточного Vite-магазину — це робиться як окрема міграція проєкту.

## MedusaJS

Якщо хочете повноцінну адмінку для товарів/складу/замовлень — рекомендовано підняти Medusa backend окремо і під’єднати цей storefront.

Деталі та питання для узгодження: див. [MEDUSA.md](MEDUSA.md)

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Application pages
  ├── data/          # Static data
  ├── styles/        # Global styles
  └── utils/         # Utilities
```

## Features

- Presentation of cleaning services
- Detailed pages for each service
- Contact form
- Responsive design
- Smooth animations

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
