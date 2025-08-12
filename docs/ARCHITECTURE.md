# Architecture Documentation

This document provides a comprehensive overview of the monorepo architecture, explaining how all components work together to create a scalable, type-safe, and maintainable system.

## Overview

This is a **production-grade Turborepo template** designed for building modern web applications with strong type safety, excellent developer experience, and enterprise-ready deployment capabilities.

### Core Principles

- **Server-First Architecture**: Prioritize server components and server-side rendering
- **Type Safety**: Strict TypeScript with no `any` types allowed
- **Package Reuse**: Centralized shared packages to prevent code duplication
- **Modern Stack**: Latest versions of Next.js, React 19, and TailwindCSS v4

## Monorepo Structure

```
turborepo-template/
├── apps/                    # Applications
│   ├── web/                # Main user-facing app (Next.js)
│   ├── admin/              # Administrative dashboard (Next.js)
│   └── api/                # Backend API service (Express)
├── packages/               # Shared packages
│   ├── auth/              # Appwrite authentication
│   ├── database/          # Prisma database layer
│   ├── ui/                # Design system & components
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   ├── env/               # Environment validation
│   ├── eslint-config/     # Shared ESLint configs
│   ├── typescript-config/ # Shared TypeScript configs
│   └── tailwind-config/   # Shared Tailwind configs
├── infrastructure/         # Terraform for GCP deployment
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Applications

### Web App (`apps/web`)
**Purpose**: Main user-facing application  
**Port**: 3001  
**Framework**: Next.js 15.3.0 + React 19.1.0

**Key Features**:
- Turbopack for development
- API client with typed responses (`lib/api.ts`)
- Docker support
- Imports all core packages

**Dependencies**:
```json
{
  "@repo/auth": "Authentication layer",
  "@repo/database": "Database operations",
  "@repo/ui": "Design system",
  "@repo/types": "Type definitions",
  "@repo/constants": "Application constants",
  "@repo/env": "Environment validation"
}
```

### Admin App (`apps/admin`)
**Purpose**: Administrative dashboard  
**Port**: 3000  
**Framework**: Next.js 15.1.4 + React 19.0.0

**Key Features**:
- Headless UI + Heroicons for accessible components
- Modern admin layout with sidebar navigation
- Shared configuration packages

**Dependencies**:
```json
{
  "@headlessui/react": "Accessible UI components",
  "@heroicons/react": "Icon library",
  "@repo/eslint-config": "Linting standards",
  "@repo/tailwind-config": "Styling configuration",
  "@repo/typescript-config": "TypeScript settings"
}
```

### API App (`apps/api`)
**Purpose**: Backend API service  
**Framework**: Express.js 4.19.2 + TypeScript

**Key Features**:
- Minimal Express server
- Hot reload with tsx watch mode
- TypeScript compilation to `dist/`

## Shared Packages

### Core Business Logic

#### `@repo/auth`
**Authentication system using Appwrite**

**Architecture**:
- **Client-side**: `appwrite` v17.0.1
- **Server-side**: `node-appwrite` v14.0.1
- **SSR Support**: Cookie-based session management

**Key Exports**:
```typescript
// Client initialization
export { getClientAppwrite, getServerClient, getSessionClient }

// Server-side helpers
export { getCurrentUser, getCurrentSession, isAuthenticated }

// Server actions
export { signInServerAction, signOutServerAction }

// Types
export type { User, Session }
```

**Files**:
- `config.ts`: Client initialization and configuration
- `helpers.ts`: Server-side auth utilities
- `actions.ts`: Server actions for auth operations
- `types.ts`: Authentication type definitions

#### `@repo/database`
**Prisma-based database layer**

**Configuration**:
- **ORM**: Prisma v5.22.0
- **Development**: SQLite
- **Production**: PostgreSQL
- **Schema**: Users and Posts with relationships

**Key Features**:
- Automated client generation
- Migration management
- Database seeding
- Studio for development

#### `@repo/types`
**Centralized TypeScript definitions**

**Structure**:
- `interfaces.ts`: Interface definitions (suffix: `I`)
- `types.ts`: Type aliases (suffix: `T`)
- `enums.ts`: Enum definitions (suffix: `E`)
- `constants.ts`: Type-safe constants

**Naming Convention**:
```typescript
interface UserDataI { ... }
type UserStatusT = 'active' | 'inactive'
enum UserRoleE { ADMIN = 'admin', USER = 'user' }
```

### Development & Configuration

#### `@repo/eslint-config`
**Shared ESLint configurations**

**Exports**:
- `base`: Core TypeScript + Turbo rules
- `next-js`: Next.js specific configuration
- `react-internal`: React component rules

**Features**:
- TypeScript ESLint v8.34.0
- Import resolution
- Turbo plugin integration

#### `@repo/typescript-config`
**Shared TypeScript configurations**

**Configurations**:
- `base.json`: Core TypeScript settings
- `nextjs.json`: Next.js specific settings
- `react-library.json`: React library settings

#### `@repo/tailwind-config`
**Shared Tailwind CSS v4 configuration**

**Features**:
- Modern Tailwind v4.1.5
- PostCSS configuration
- Shared theme variables
- Custom CSS properties

### UI & Utilities

#### `@repo/ui`
**Shadcn/ui-based design system and reusable components**

**Component Library**:
- **Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS v4 with CSS variables for theming
- **Utilities**: `cn()` function for className merging (clsx + tailwind-merge)
- **Variants**: Class Variance Authority (CVA) for component variants

**Key Dependencies**:
```json
{
  "@radix-ui/react-icons": "Icons library",
  "@radix-ui/react-slot": "Composition primitives", 
  "class-variance-authority": "Component variants",
  "clsx": "Conditional classes",
  "tailwind-merge": "Tailwind class merging"
}
```

**Build System**:
```json
{
  "build:components": "tsc",
  "build:styles": "tailwindcss -i ./src/styles.css -o ./dist/index.css"
}
```

**Available Components**:
- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card**: Complete card system (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Utils**: `cn()` utility for className composition

**Adding New Components**:
```bash
# Navigate to UI package
cd packages/ui

# Install additional Shadcn components
pnpm dlx shadcn@latest add input label form dialog
```

**Exports**:
- Shadcn/ui component library
- CSS bundle with theme variables (`./styles.css`)
- Utility functions (`cn`)

#### `@repo/constants`
**Application-wide constants**

**Structure**:
- `api.ts`: API endpoints and configuration
- `app.ts`: Application constants
- `analytics.ts`: Analytics configuration

#### `@repo/env`
**Environment variable validation**

**Features**:
- Zod v3.23.8 for schema validation
- Client/server environment separation
- Type-safe environment variables

**Structure**:
- `client.ts`: Client-side environment variables
- `server.ts`: Server-side environment variables
- `index.ts`: Unified exports

## Build System

### Turborepo Configuration

**Global Settings**:
```json
{
  "concurrency": 15,
  "globalEnv": ["NODE_ENV"],
  "globalPassThroughEnv": ["PORT"]
}
```

**Task Pipeline**:
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**", ".next/**"]
  },
  "dev": {
    "cache": false,
    "persistent": true
  }
}
```

### Package Manager
**PNPM Workspaces** with intelligent dependency resolution and efficient storage.

**Configuration**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Infrastructure & Deployment

### Google Cloud Platform (Terraform)

**Services**:
- **Cloud Run**: Application hosting with auto-scaling
- **Cloud SQL**: PostgreSQL 15 with private networking
- **Cloud Storage**: File storage with CORS and lifecycle rules
- **Artifact Registry**: Docker image storage
- **Secret Manager**: Environment variable management
- **VPC**: Private networking with security controls

**Cost Optimization**:
- `db-f1-micro` database tier
- Minimal VPC connector instances
- Zonal deployment
- Automated backup retention

### Docker Configuration

**Services**:
```yaml
services:
  postgres: PostgreSQL 15-alpine with health checks
  web: Next.js application with volume mounts
  redis: Redis for caching/sessions
```

### CI/CD Pipeline

**Workflows**:
- `ci.yml`: Security audits and dependency checks
- `deploy.yml`: Automated deployment to GCP
- `update-dependencies.yml`: Automated dependency updates

**Features**:
- Concurrency control
- PNPM caching
- Multi-environment support

## Data Flow Architecture

### Authentication Flow
```
Client → Appwrite → Server Action → Cookie → SSR
```

1. User authenticates via Appwrite
2. Server action sets secure HTTP-only cookie
3. Server components read session from cookie
4. SSR renders authenticated state

### Database Flow
```
App → @repo/database → Prisma → PostgreSQL
```

1. Applications import database client
2. Prisma provides type-safe queries
3. Automatic connection pooling
4. Migration management

### UI Component Flow
```
App → @repo/ui → Shadcn/ui → Radix UI → TailwindCSS v4 → Styled Components
```

1. Applications import Shadcn/ui components from `@repo/ui`
2. Shadcn components are built on Radix UI primitives for accessibility
3. CSS variables enable easy theming and customization
4. TailwindCSS v4 provides utility-first styling
5. Component variants managed by Class Variance Authority (CVA)

## Package Dependencies

### Dependency Graph
```
apps/web → @repo/auth, @repo/database, @repo/ui, @repo/types, @repo/constants, @repo/env
apps/admin → @repo/eslint-config, @repo/tailwind-config, @repo/typescript-config
apps/api → @repo/typescript-config

@repo/auth → @repo/types
@repo/ui → @repo/types, @repo/tailwind-config
@repo/database → @repo/typescript-config
```

### Build Order
1. **Types & Constants**: `@repo/types`, `@repo/constants`
2. **Configuration**: `@repo/typescript-config`, `@repo/eslint-config`, `@repo/tailwind-config`
3. **Core Packages**: `@repo/database`, `@repo/auth`, `@repo/env`
4. **UI Package**: `@repo/ui`
5. **Applications**: `apps/api`, `apps/web`, `apps/admin`

## Development Experience

### Code Quality
- **ESLint**: v9.29.0 with TypeScript support
- **Prettier**: v3.5.3 with Tailwind plugin
- **TypeScript**: v5.8.2 strict mode
- **Husky**: Pre-commit hooks for validation
- **Commitlint**: Conventional commit standards

### Developer Workflow
1. **Setup**: `pnpm install` → environment validation → database generation
2. **Development**: `pnpm dev` → all apps run concurrently with hot reload
3. **Quality**: Automatic linting, formatting, and type checking
4. **Testing**: Cypress E2E tests across applications
5. **Build**: `pnpm build` → Turborepo orchestrates builds with caching

### Environment Management
- **Validation**: Custom script validates all required variables
- **Type Safety**: Zod schemas ensure runtime type safety
- **Multi-Environment**: Separate client/server environment handling

## Security Architecture

### Authentication Security
- **No API Keys**: Workload Identity Federation for GCP
- **Session Management**: HTTP-only secure cookies
- **Server-Side Validation**: All auth checks on server
- **Type Safety**: Strict typing prevents auth bypass

### Infrastructure Security
- **Private Networking**: VPC with private IP ranges
- **Secret Management**: GCP Secret Manager for all secrets
- **IAM**: Least privilege access controls
- **Container Security**: Multi-stage Docker builds

### Code Security
- **No `any` Types**: Strict TypeScript prevents type-related vulnerabilities
- **Dependency Audits**: Automated security audits in CI/CD
- **Environment Validation**: Runtime validation of all environment variables

## Performance Architecture

### Build Performance
- **Turborepo Caching**: Intelligent build caching across packages
- **Package Isolation**: Independent builds prevent unnecessary rebuilds
- **Concurrent Execution**: Parallel task execution with dependency awareness

### Runtime Performance
- **Server-First**: Minimize client-side JavaScript
- **Code Splitting**: Next.js automatic code splitting
- **Static Generation**: Pre-rendered pages where possible
- **CDN**: Cloud Storage with global distribution

### Development Performance
- **Turbopack**: Fast development builds
- **Hot Reload**: Instant feedback across all applications
- **Type Checking**: Incremental TypeScript compilation

## Scalability Considerations

### Horizontal Scaling
- **Stateless Applications**: Cloud Run auto-scaling
- **Database Scaling**: Cloud SQL with read replicas
- **CDN Scaling**: Global asset distribution

### Code Scaling
- **Monorepo Benefits**: Shared code, consistent standards
- **Package Isolation**: Independent deployments possible
- **Type Safety**: Reduces bugs as codebase grows

### Team Scaling
- **Clear Conventions**: Documented coding standards
- **Package Ownership**: Clear responsibility boundaries
- **Automated Quality**: Consistent code quality enforcement

## Future Considerations

### Potential Enhancements
- **Micro-frontends**: Package structure supports independent frontend apps
- **API Gateway**: Centralized API management
- **Monitoring**: Observability and performance monitoring
- **Testing**: Unit tests for individual packages

### Technology Evolution
- **React Server Components**: Already positioned for latest React features
- **Edge Computing**: Vercel Edge or Cloudflare Workers integration
- **Database Evolution**: Easy migration to other Prisma-supported databases

This architecture provides a solid foundation for building scalable, maintainable web applications with excellent developer experience and production-ready deployment capabilities.