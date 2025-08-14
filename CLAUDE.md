# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Sales Stack Ranker 2.0 is a predictive analytics platform for sales teams built with Next.js 15, TypeScript, and Prisma. The application provides opportunity scoring, pipeline analytics, rep performance tracking, and predictive insights for sales organizations.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linting
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and reseed
- `npm run db:studio` - Launch Prisma Studio

### Database Operations
The project uses Prisma with PostgreSQL. Always run `npm run db:generate` after schema changes. Use `npm run db:seed` to populate with sample sales data for development.

## Architecture & Structure

### Core Technologies
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context for filters and theme
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Key Architectural Patterns

/src
  /pages           # Next.js UI routes (or /app for App Router)
  /components      # React UI components
  /styles          # CSS/SCSS, etc.
  /server          # All server/backend logic
    /dal           # Interfaces & implementations for data access
      index.ts
      in-memory.ts
      postgres.ts
    /storage       # Schema definitions, migrations, raw queries
      schema.ts
      pg-storage.ts
    /routes        # API route handlers (if using app/api or pages/api)
  /lib             # Shared utilities (formatters, validation, etc.)
  /hooks           # Custom React hooks
  /context         # React context providers
  /utils           # Miscellaneous helpers


**Data Layer**: Centralized in `/lib/prisma.ts` with comprehensive schema covering opportunities, accounts, interactions, predictions, and benchmarks.

**Component Structure**: 
- `/components/ui/` - shadcn/ui base components
- `/components/` - Custom business components (charts, sidebar, filters)
- `/contexts/` - React Context providers for global state

**Page Structure**: App Router with main sections:
- `/` - Overview dashboard
- `/opportunities` - Predictive analytics & opportunity drilldowns  
- `/pipeline` - Pipeline funnel analysis
- `/reps` - Sales rep performance metrics
- `/sources` - Lead source attribution

### Database Schema

The Prisma schema defines comprehensive sales data models:
- **Opportunity** - Core sales opportunities with predictions
- **Account/Contact** - Customer relationship data
- **Interaction/Transcript** - Sales activity tracking
- **Prediction/FeatureSnapshot** - ML model outputs and features
- **Rep/Pipeline/Source** - Sales operation entities

### State Management

**FilterContext** (`/contexts/filter-context.tsx`): Global filtering state for stages, reps, regions, and date ranges. Used across analytics pages for consistent data filtering.

**ThemeContext** (`/contexts/theme-context.tsx`): Dark/light mode theming with next-themes integration.

### Sample Data

Sample data is defined in `/lib/sample-data.ts` with realistic sales opportunities and rep metrics. The seed script populates the database for development and demo purposes.

## Development Guidelines

### Component Development
- Follow shadcn/ui patterns for new components
- Use TypeScript interfaces for all prop types
- Implement proper error boundaries for data components
- Charts should use the established color palette from tailwind.config.ts

### Database Changes  
- Always update Prisma schema first
- Run `npm run db:generate` after schema changes
- Update seed data if new required fields are added
- Consider data migration scripts for production changes

### Styling Conventions
- Use Tailwind CSS utility classes
- Follow the established design system in `/components/ui/`
- Responsive design with mobile-first approach
- Consistent spacing and typography scales

### Performance Considerations
- Use React.useMemo for expensive data filtering operations
- Implement proper loading states for async operations
- Optimize chart rendering for large datasets
- Consider pagination for large opportunity lists

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection for migrations

## Testing & Quality

The project has ESLint configured with TypeScript support. Build errors and TypeScript errors are currently ignored in production builds (see next.config.mjs), but should be addressed in development.

Always run `npm run lint` before committing changes to catch potential issues.