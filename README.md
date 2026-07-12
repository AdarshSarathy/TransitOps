# TransitOps - Smart Transport Operations Platform

TransitOps is a centralized ERP designed for logistics companies to manage fleets, dispatch trips, track maintenance, and enforce driver compliance.

## Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Backend/API**: React Server Actions
- **Database**: SQLite (via Prisma ORM) for zero-config local deployment
- **Styling**: Tailwind CSS v4
- **Maps**: Google Maps API

## Key Features
- **Role-Based Access Control (RBAC)**: Fine-grained access for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.
- **Smart Load Validator**: Automatically checks cargo weight against vehicle capacity.
- **Auto-Suspension Compliance Engine**: Enforces rules to block trip assignments for drivers with expired licenses or suspended statuses.
- **Operational Cost & ROI Aggregator**: Computes total operational costs (fuel + maintenance) per vehicle and aggregates fleet ROI.

## Demo Credentials

The platform is seeded with 4 predefined users:

| Role | Email | Password |
|---|---|---|
| Fleet Manager | `fleet.manager@transitops.in` | `Transit@2026` |
| Dispatcher | `dispatcher@transitops.in` | `Transit@2026` |
| Safety Officer | `safety.officer@transitops.in` | `Transit@2026` |
| Financial Analyst | `financial.analyst@transitops.in` | `Transit@2026` |

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add your Google Maps API Key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
