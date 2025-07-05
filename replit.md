# Business Analytics Dashboard

## Overview

This is a full-stack web application that provides business analytics and SEO headline generation services. The application allows users to submit business information (name and location) and receive generated analytics including ratings, review counts, and SEO-optimized headlines.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Radix UI components with Tailwind CSS styling using shadcn/ui design system
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: REST API with JSON responses
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with migrations support
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity

## Key Components

### Shared Schema (`shared/schema.ts`)
- Centralized data models and validation schemas
- User and Business entity definitions
- Zod validation schemas for API requests
- Type-safe interfaces shared between frontend and backend

### Storage Layer (`server/storage.ts`)
- Abstracted storage interface for flexibility
- In-memory implementation for development
- Ready for PostgreSQL production deployment
- Business and user management operations

### API Routes (`server/routes.ts`)
- RESTful endpoints for business data submission
- Simulated business metrics generation (rating: 4.0-5.0, reviews: 50-250)
- SEO headline generation with 10 unique templates
- Error handling and validation

### UI Components
- Modern component library based on Radix UI primitives
- Consistent design system with CSS custom properties
- Dark/light theme support
- Responsive design with mobile-first approach
- Form validation with real-time feedback

## Data Flow

1. **User Input**: User submits business name and location via form
2. **Validation**: Frontend validates input using Zod schemas
3. **API Request**: TanStack Query sends POST request to `/api/business-data`
4. **Processing**: Server validates data, generates metrics and SEO headline
5. **Storage**: Business data stored in memory (development) or PostgreSQL (production)
6. **Response**: Generated analytics returned to frontend
7. **Display**: Results displayed in dashboard with option to regenerate headlines

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **@radix-ui/***: Headless UI component primitives
- **class-variance-authority**: Utility for component variant styling
- **clsx & tailwind-merge**: CSS class manipulation utilities
- **wouter**: Lightweight routing library

### Backend Dependencies
- **drizzle-orm**: Type-safe SQL ORM
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **express**: Web application framework
- **zod**: Schema validation library

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- In-memory storage for rapid iteration
- Replit-specific optimizations and error overlays

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild compiles server code to `dist/index.js`
- PostgreSQL database with Drizzle migrations
- Environment variables for database connection

### Database Setup
- PostgreSQL configured via `DATABASE_URL` environment variable
- Drizzle migrations in `./migrations` directory
- Schema defined in `shared/schema.ts`
- Push migrations with `npm run db:push`

## Changelog
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.