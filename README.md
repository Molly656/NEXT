# Pulse Dashboard

A full-stack business dashboard built with **Next.js 15**, featuring invoice management, customer tracking, revenue analytics, and secure authentication — all backed by a PostgreSQL database.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Pages and Routes](#pages-and-routes)
- [Scripts](#scripts)
- [Known Limitations](#known-limitations)

---

## Overview

Pulse Dashboard is a production-ready web application that lets businesses manage their day-to-day operations from a single interface. Users can sign up, log in, and immediately access a live dashboard that tracks revenue trends, outstanding invoices, and customer data — all in real time from a PostgreSQL database.

The project is built entirely with the **Next.js App Router**, using React Server Components for data fetching, Server Actions for mutations, and NextAuth v5 for session management.

---

## Live Demo

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

After deployment, set the [required environment variables](#environment-variables) in your Vercel project settings.

---

## Features

### Authentication

- User sign-up with name, email, and password
- Secure login with email and password credentials
- Passwords hashed with `bcryptjs` before storage — plain-text passwords never touch the database
- Session management via NextAuth v5
- Route protection through Next.js Middleware — unauthenticated users are automatically redirected to `/login`

### Dashboard

- Revenue chart showing monthly earnings at a glance
- Latest 5 invoices listed in real time
- Summary cards: total invoices, total customers, total amount paid, total amount pending

### Invoice Management

- View all invoices with live search and pagination
- Create new invoices (select customer, set amount and status)
- Edit existing invoices
- Delete invoices
- Search across customer name, email, amount, date, and status

### Customer Management

- View all customers with aggregated invoice summaries
- Search customers by name or email
- Add new customers — avatars are auto-generated via UI Avatars
- Paginated table showing each customer's total paid and total pending amounts

### Landing Page

- Full-screen hero with a background image and gradient overlay
- Headline and sub-copy that communicate the product value
- Call-to-action buttons routing directly to sign-up and login

---

## Tech Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Framework       | Next.js 15 (App Router)    |
| Language        | TypeScript                 |
| Styling         | Tailwind CSS               |
| Database        | PostgreSQL via Neon        |
| Database Client | postgres.js                |
| Authentication  | NextAuth.js v5 (beta)      |
| Validation      | Zod                        |
| Icons           | Heroicons                  |
| Fonts           | Google Fonts via next/font |
| Deployment      | Vercel                     |

---

## Project Structure

```
pulse-dashboard/
├── app/
│   ├── page.tsx                         # Landing page (hero + CTAs)
│   ├── layout.tsx                       # Root layout
│   ├── login/
│   │   └── page.tsx                     # Login page
│   ├── signup/
│   │   └── page.tsx                     # Sign-up page
│   ├── dashboard/
│   │   ├── (overview)/
│   │   │   ├── page.tsx                 # Dashboard home
│   │   │   └── loading.tsx              # Streaming skeleton loader
│   │   ├── layout.tsx                   # Dashboard shell with sidenav
│   │   ├── invoices/
│   │   │   ├── page.tsx                 # Invoice list (search + pagination)
│   │   │   ├── create/page.tsx          # Create invoice form
│   │   │   └── [id]/edit/page.tsx       # Edit invoice form
│   │   └── customers/
│   │       ├── page.tsx                 # Customer list (search + pagination)
│   │       └── create/page.tsx          # Add customer form
│   ├── lib/
│   │   ├── db.ts                        # Shared PostgreSQL connection pool
│   │   ├── data.ts                      # All read queries (Server Components)
│   │   ├── action.ts                    # All write mutations (Server Actions)
│   │   ├── signup.ts                    # Sign-up server action
│   │   ├── definitions.ts               # TypeScript type definitions
│   │   └── utils.ts                     # Helpers — formatCurrency, generatePagination
│   └── ui/
│       ├── login-form.tsx               # Shared login / sign-up form component
│       ├── button.tsx                   # Reusable button
│       ├── dashboard/                   # Cards, revenue chart, latest invoices, sidenav
│       ├── invoices/                    # Invoice table, forms, pagination, buttons
│       └── customers/                   # Customer table, create form
├── auth.ts                              # NextAuth setup + credentials authorize logic
├── auth.config.ts                       # Auth callbacks + route protection rules
├── middleware.ts                        # Edge middleware — guards all /dashboard routes
├── next.config.ts                       # Next.js config (allowed image domains)
├── tailwind.config.ts                   # Tailwind theme config
└── tsconfig.json                        # TypeScript compiler options
```

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (or pnpm / yarn)
- A PostgreSQL database — [Neon](https://neon.tech) has a generous free tier that works out of the box

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pulse-dashboard.git
cd pulse-dashboard

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Open .env and fill in your POSTGRES_URL and AUTH_SECRET

# 4. Create the database tables (see Database Setup below)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## Environment Variables

Create a `.env` file at the project root. It must contain the following two variables:

```env
# PostgreSQL connection string
# Works with Neon, Supabase, Railway, or any Postgres provider
POSTGRES_URL="postgresql://user:password@host/dbname?sslmode=require"

# Secret used to sign and verify NextAuth session tokens
# Must be a long random string — never share it publicly
AUTH_SECRET="your-random-secret-here"
```

**Generating AUTH_SECRET**

```bash
# Option 1 — openssl (available on most systems)
openssl rand -hex 32

# Option 2 — NextAuth CLI
npx auth secret
```

> Your `.env` file is listed in `.gitignore` and will never be committed. Do not paste real credentials into the `.env.example` file.

---

## Database Setup

Run the following SQL in your database console (e.g. the Neon SQL editor) to create the required tables.

```sql
-- Users table (stores hashed passwords — never plain text)
CREATE TABLE IF NOT EXISTS users (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name     VARCHAR(255) NOT NULL,
  email    TEXT         NOT NULL UNIQUE,
  password TEXT         NOT NULL
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(255) NOT NULL
);

-- Invoices table
-- Amounts are stored in cents (e.g. $10.00 = 1000) to avoid floating-point errors
CREATE TABLE IF NOT EXISTS invoices (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID         NOT NULL REFERENCES customers(id),
  amount      INT          NOT NULL,
  status      VARCHAR(255) NOT NULL CHECK (status IN ('pending', 'paid')),
  date        DATE         NOT NULL
);

-- Revenue table (one row per month for the revenue chart)
CREATE TABLE IF NOT EXISTS revenue (
  month   VARCHAR(4) NOT NULL UNIQUE,
  revenue INT        NOT NULL
);
```

Seed the `revenue` table with some sample data to populate the chart:

```sql
INSERT INTO revenue (month, revenue) VALUES
  ('Jan', 2000), ('Feb', 1800), ('Mar', 2200),
  ('Apr', 2500), ('May', 2300), ('Jun', 3200),
  ('Jul', 3500), ('Aug', 3700), ('Sep', 2900),
  ('Oct', 3100), ('Nov', 3800), ('Dec', 4200)
ON CONFLICT (month) DO NOTHING;
```

---

## Authentication

Authentication is handled by NextAuth.js v5 using the Credentials provider.

| Flow                | Behaviour                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Sign up             | Validates the form with Zod, hashes the password with bcryptjs, inserts the user, then redirects to `/login`                       |
| Log in              | Looks up the user by email, uses bcryptjs to compare the submitted password against the stored hash, then creates a signed session |
| Route protection    | `middleware.ts` runs on every request — any `/dashboard` route without a valid session is immediately redirected to `/login`       |
| Post-login redirect | After a successful login the user lands on `/dashboard`                                                                            |
| Public access       | `/login` and `/signup` stay accessible even when logged in, so users can switch accounts without logging out first                 |

---

## Pages and Routes

| Route                           | Access    | Description                                                     |
| ------------------------------- | --------- | --------------------------------------------------------------- |
| `/`                             | Public    | Landing page with hero image and call-to-action buttons         |
| `/login`                        | Public    | Email and password login form                                   |
| `/signup`                       | Public    | Name, email, and password registration form                     |
| `/dashboard`                    | Protected | Overview with revenue chart, latest invoices, and summary cards |
| `/dashboard/invoices`           | Protected | Paginated invoice list with search                              |
| `/dashboard/invoices/create`    | Protected | Form to create a new invoice                                    |
| `/dashboard/invoices/[id]/edit` | Protected | Form to edit an existing invoice                                |
| `/dashboard/customers`          | Protected | Paginated customer list with search                             |
| `/dashboard/customers/create`   | Protected | Form to add a new customer                                      |

---

## Scripts

```bash
npm run dev      # Start the development server (Turbopack)
npm run build    # Compile a production build
npm run start    # Start the production server
npm run lint     # Run ESLint across the project
```

---

## Known Limitations

- **Debug route** — `/app/query/route.ts` is a raw SQL query endpoint left over from development. It should be removed or secured before going to production.
- **Search performance** — Search uses PostgreSQL `ILIKE`, which is sufficient for small datasets. At high volume, a dedicated full-text search solution (PostgreSQL `tsvector` or Algolia) would be more efficient.
- **No email verification** — Users can register with any email address without verification. Adding an email confirmation step is recommended for production use.
- **Hardcoded page size** — Pagination is fixed at 6 items per page (`ITEMS_PER_PAGE` in `app/lib/data.ts`). This can be made configurable by the user if needed.
- **Single role** — All authenticated users have equal access to all dashboard features. Role-based access control (RBAC) is not implemented.
