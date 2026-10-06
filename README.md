# Wanas ERP — React Administration Dashboard

A React frontend for real estate and construction operations, with management screens for properties, clients, suppliers, sales, payments, and reporting.

## Features

- Land, building, and unit management with list, detail, create, and edit screens.
- Client, contractor, supplier, and work-item workflows.
- Material purchases, unit sales, installments, and payment records.
- Financial transactions, income/expense reporting, and audit-log screens.
- Search and filtering, pagination, summary cards, form validation, and confirmation dialogs.
- Dedicated loading, error, and empty states with reusable UI components.

## Stack

React 19 · JavaScript · React Router · Tailwind CSS 4 · Axios · Framer Motion · Lucide · Vite · Oxlint.
TanStack Query is also included in the project dependencies.

## Run locally

Install a Node.js version compatible with the Vite version in `package.json`.

```bash
git clone https://github.com/tamer780/wanas-erp.git
cd wanas-erp
npm ci
npm run dev
```

Open the local URL printed by Vite.

**Backend requirement:** this repository contains the frontend. Data and login depend on an external API configured in [src/services/api/axios.js](src/services/api/axios.js). Full workflows require authorized backend access; no public demo credentials are provided.

## Code organization

| Location | Responsibility |
| --- | --- |
| `src/routes/` | Routes and reusable CRUD route definitions |
| `src/pages/` | Module screens and workflow coordination |
| `src/components/` | Module components, shared controls, and state views |
| `src/services/` | API client and domain-specific request functions |
| `src/utils/` | Validation, formatting, and UI helpers |
| `src/layouts/` | Authentication and dashboard layouts |

## Engineering highlights

- Consistent module structure across business domains.
- A centralized Axios client with bearer-token and multipart handling.
- Explicit request, submission, refresh, and failure states.
- Building lists normalize paginated API responses and derive filtered summaries.

Start the code review with [the route configuration](src/routes/index.jsx), [the buildings workflow](src/pages/Buildings/Buildings.jsx), and [the API client](src/services/api/axios.js).

## Checks

```bash
npm run lint
npm run build
npm run preview
```

The preview script uses port 5174. These commands are available checks, not a claim that CI has passed. No automated test suite is included in the current repository.
