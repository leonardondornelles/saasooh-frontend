<div align="center">

# Setdoor — Frontend

**Control panel for Out-of-Home (OOH) media companies**

Interactive inventory map, sales pipeline, occupancy calendar, and financial dashboard in a single interface.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3-8884d8)](https://recharts.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

[Backend (Spring Boot)](https://github.com/leonardondornelles/saasooh-backend) · [Features](#features) · [Tech stack](#tech-stack) · [Getting started](#getting-started-locally)

</div>

---

## About the project

**Setdoor** is the web interface of a B2B SaaS platform for Out-of-Home media companies — billboards, front lights, tri-vision structures, LED screens, and highway panels — to manage inventory, campaigns, customers, and billing from a single dashboard.

The project was born from a real problem: out-of-home media companies manage all of this through spreadsheets. This frontend consumes the [Spring Boot REST API](https://github.com/leonardondornelles/saasooh-backend) built alongside it, and was designed to be the daily working tool for people who sell and operate advertising panels: from the availability map to the sales pipeline and the financial health of the operation.

---

## Screenshots

| Overview | Financial Dashboard |
|---|---|
| ![Overview](./screenshots/Visao_Geral.png) | ![Finance](./screenshots/Finances_WIP.png) |

| Panel Detail (faces + timeline) | Occupancy Calendar |
|---|---|
| ![Panel](./screenshots/Panel_OUDOOR_CLIENTS.png) | ![Calendar](./screenshots/Panel_OUDOOR_CALENDAR.png) |

| Customer Management | Company Hub |
|---|---|
| ![Customers](./screenshots/clients_Gestao.png) | ![Hub](./screenshots/ADMIN_hub.png) |

| Inventory with map | LED Panel |
|---|---|
| ![Inventory](./screenshots/Inventario_Paineis.png) | ![LED](./screenshots/Panel_LED.png) |

---

## Features

### Landing page
Public marketing page (`/`) with feature sections, pricing plans (Basic / Pro / Enterprise), and registration CTAs — each plan's button pre-fills the sign-up form via query string (`/register?plan=PRO`).

### Overview
Time-based personalized greeting (good morning / good afternoon / good evening) with the authenticated user's name, plus quick shortcuts to Inventory, Campaigns, and Customers.

### Panel Inventory
- Panel registration (address, city, GPS coordinates, type, illumination)
- Interactive map with Leaflet/OpenStreetMap: each panel appears as a geolocated marker with a popup showing type, city, available faces, and a direct link to the panel's page; the map automatically adjusts zoom and bounds to the filtered panels
- Card-based listing with type, identification code, and location
- Detail page with an interactive visual representation of faces per panel type (Outdoor with 2 faces, LED with up to 5, Empena with 1, etc.)
- Clicking a face opens a sidebar with status (occupied / available / reserved), current customer, monthly value, start/end dates, and a campaign progress bar
- Quick actions: New Booking and Calendar per face

### Occupancy Calendar
- Monthly calendar modal per campaign face
- Days marked according to campaign status (active/reserved vs. available)
- Month-to-month navigation

### Campaign Hub (Sales Pipeline)
- Central table with all the company's campaigns: customer, panel/face, period, investment, and pipeline stage
- Filter by status (Proposal, Negotiation, Approved, Reserved, Active, Completed, Lost, Cancelled) and text search
- Campaign creation with cascading selection (panel → available faces for that panel)
- Status updates via modal, enforcing the same business rules as the backend (an already-active campaign cannot be moved back to negotiation stages)
- Direct shortcut to the panel where the campaign is being displayed

### Financial Dashboard
Area restricted to `ADMIN` and `FINANCIAL` roles:
- KPIs: active MRR, projected ARR, average ticket, total occupancy, contracts expiring within 30 days, and delinquency
- Area chart (Recharts): actual vs. projected revenue, month by month
- Sales rep ranking by revenue volume (horizontal bar chart)
- Occupancy by city, with progress bars and indicators by percentage range
- Sales pipeline funnel (proposals → negotiation → approved)
- Contract expiration alerts, color-coded by urgency level
- Delinquency panel with customers and outstanding amounts

### Customers and Agencies
- Cards with trade name, corporate name, CNPJ, phone, and email
- Search by name or CNPJ
- Customer profile with total revenue, average ticket, and campaign history
- Action to grant customer portal access (PRO/ENTERPRISE plans)

### Company Hub
- Active SaaS plan with panel limit (BASIC / PRO / ENTERPRISE)
- KPIs: panels in use, total company MRR, and team size
- Member table with role (Admin, Sales, Finance) and status
- New employee registration form, restricted to `ADMIN` users

### Invoices (in progress)
Invoice screen with listing, search, and a payment registration modal (PIX, among other methods) already implemented in the interface — full backend integration (invoices endpoint) is still under development, which is why this section is not shown in the sidebar by default.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts (area, bar) |
| Maps | Leaflet + React-Leaflet (OpenStreetMap tiles) |
| Icons | Lucide React |
| HTTP | Axios, with an authentication interceptor |
| Authentication | JWT stored in a cookie (`saas_token`), read on every request |
| Route protection | Next.js middleware (`src/middleware.ts`) |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── login/                # Login screen
│   ├── register/             # New tenant registration (with plan pre-selected via query string)
│   └── dashboard/
│       ├── page.tsx          # Overview
│       ├── layout.tsx        # Sidebar, role-based dynamic menu, logout
│       ├── panels/           # Panel inventory + Leaflet map
│       ├── panel/[id]/       # Panel detail, faces, and campaigns
│       ├── campaigns/        # Campaign hub (sales pipeline)
│       ├── customers/        # Customers and agencies
│       ├── customers/[id]/   # Customer profile
│       ├── finance/          # Financial dashboard (ADMIN / FINANCIAL)
│       ├── invoices/         # Invoices (in progress)
│       ├── team/[id]/        # Team member profile
│       └── company/          # Company hub (ADMIN only)
├── components/
│   └── MapComponent.tsx      # Reusable Leaflet map, with markers and auto-fit bounds
├── services/
│   └── api.ts                 # Axios instance with JWT interceptor
└── middleware.ts               # Protects /dashboard/* and redirects already-authenticated users
```

---

## Authentication and access control

- The JWT returned by the backend is stored in the `saas_token` cookie
- An Axios interceptor injects the `Authorization: Bearer <token>` header into every API call
- Next.js `middleware.ts` blocks access to `/dashboard/*` without a token (redirecting to the landing page) and redirects already-authenticated users away from `/`
- The sidebar menu is built dynamically based on the `role` returned by `/api/users/me`: only `ADMIN` sees "Company Hub"; `ADMIN` and `FINANCIAL` see "Finance"

---

## Getting started locally

### Prerequisites
- Node.js 18+
- [Backend (Spring Boot)](https://github.com/leonardondornelles/saasooh-backend) running at `http://localhost:8080`

### 1. Clone the repository
```bash
git clone https://github.com/leonardondornelles/saasooh-frontend.git
cd saasooh-frontend
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Run
```bash
npm run dev
```

Visit `http://localhost:3000`.

> The API URL is currently hardcoded in `src/services/api.ts` (`http://localhost:8080`). To point to a different environment, update this value or — as planned in the roadmap — migrate it to an environment variable (`NEXT_PUBLIC_API_URL`).

---

## Roadmap

- [ ] Move the API base URL to an environment variable (`NEXT_PUBLIC_API_URL`)
- [ ] Complete backend integration for the Invoices module and add it to the sidebar
- [ ] Generate commercial proposals as PDF directly from the campaigns screen
- [ ] Component tests (React Testing Library) for critical flows (campaign creation, panel map)
- [ ] Internationalization (the entire interface is currently in pt-BR, including status enum values coming from the backend)

---

## Author

**Leonardo Noronha Dornelles**
Computer Science student — PUCRS

[GitHub](https://github.com/leonardondornelles) · [LinkedIn](https://www.linkedin.com/in/leonardo-noronha-dornelles-3a7151324/)
