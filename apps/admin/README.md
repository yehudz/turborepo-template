# Web App - Next.js with Clerk Authentication

The main web application with user authentication, protected routes, and API endpoints.

## 🚀 Features

- **Authentication**: Clerk-based auth with sign-up, sign-in, and user management
- **Protected Routes**: Automatic route protection for authenticated users
- **API Routes**: Next.js API routes with authentication middleware
- **Database Integration**: Prisma ORM for data persistence
- **Responsive Design**: Tailwind CSS with mobile-first approach

## 🔧 Configuration

### **Environment Variables**

This app requires these environment variables in the root `.env.local`:

```bash
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_here"

# App URLs (REQUIRED for production)
NEXT_PUBLIC_APP_URL="http://localhost:3001"  # This app's URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api"  # This app's API

# Database (REQUIRED)
DATABASE_URL="file:./dev.db"  # SQLite for dev, PostgreSQL for prod

# Security (REQUIRED for JWT tokens)
JWT_SECRET="your-32-character-secret-here"
```

### **🚨 MUST UPDATE Before Development**

1. **Clerk Setup**:
   ```bash
   # 1. Create account at https://clerk.com
   # 2. Create new application
   # 3. Copy publishable key and secret key
   # 4. Add to .env.local file
   ```

2. **Database Connection**:
   ```bash
   # Development (SQLite)
   DATABASE_URL="file:./dev.db"
   
   # Production (PostgreSQL) 
   DATABASE_URL="postgresql://user:pass@host:port/database"
   ```

3. **Production URLs**:
   ```bash
   # Update these with your actual domain
   NEXT_PUBLIC_APP_URL="https://yourapp.com"
   NEXT_PUBLIC_API_URL="https://yourapp.com/api"
   ```

## 🛠️ Development

### **Start Development Server**

```bash
# From project root
pnpm dev

# Or run just this app
cd apps/web
pnpm dev
```

The app will be available at `http://localhost:3001`

### **Key Commands**

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-related pages
│   │   ├── sign-in/       # Sign in page
│   │   └── sign-up/       # Sign up page
│   ├── api/               # API routes
│   │   └── auth/          # Auth endpoints
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with Clerk
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── auth/             # Auth-specific components
├── lib/                  # Utility functions
│   ├── auth.ts           # Auth helpers
│   ├── db.ts             # Database client
│   └── utils.ts          # General utilities
├── middleware.ts         # Clerk middleware for route protection
├── next.config.js        # Next.js configuration
└── package.json          # App dependencies
```

## 🔐 Authentication Flow

### **Public Routes**
- `/` - Home page
- `/sign-in` - Sign in page  
- `/sign-up` - Sign up page

### **Protected Routes**  
- `/dashboard` - User dashboard (requires auth)
- `/api/protected/*` - Protected API routes

### **Route Protection**

Routes are automatically protected using Clerk middleware:

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"]
})
```

## 🗃️ Database Integration

### **Database Setup**

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Run migrations (production)
pnpm db:migrate
```

### **Using Database in Components**

```typescript
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export default async function Dashboard() {
  const { userId } = auth()
  
  const user = await db.user.findUnique({
    where: { clerkId: userId }
  })
  
  return <div>Welcome {user?.email}</div>
}
```

## 🎨 Styling & UI

### **Tailwind CSS**
- Pre-configured with custom design system
- Responsive utilities for mobile-first design
- Custom components in `@repo/ui` package

### **Component Usage**

```typescript
import { Button } from "@repo/ui"
import { Card } from "@repo/ui"

export default function Example() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  )
}
```

## 🔌 API Routes

### **Creating Protected API Routes**

```typescript
// app/api/protected/route.ts
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Your protected logic here
  return NextResponse.json({ data: "Protected data" })
}
```

### **Available Endpoints**

- `GET /api/auth/user` - Get current user info
- `POST /api/auth/user` - Update user info
- `GET /api/protected/data` - Get user-specific data

## 🚀 Deployment

### **Production Build**

```bash
# Build the application
pnpm build

# Test production build locally
pnpm start
```

### **Environment Variables for Production**

```bash
# Production Clerk keys (get from Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_your_live_key"
CLERK_SECRET_KEY="sk_live_your_live_secret"

# Production URLs
NEXT_PUBLIC_APP_URL="https://yourapp.com"
NEXT_PUBLIC_API_URL="https://yourapp.com/api"

# Production database
DATABASE_URL="postgresql://user:pass@host:port/database"

# Strong JWT secret for production
JWT_SECRET="your-super-secure-32-char-secret"
```

### **Deployment Checklist**

- [ ] Update Clerk allowed domains in dashboard
- [ ] Set production environment variables
- [ ] Run database migrations: `pnpm db:migrate`
- [ ] Test authentication flow
- [ ] Verify API endpoints work
- [ ] Check responsive design

## 🧪 Testing

### **Running Tests**

```bash
# Start dev server first
pnpm dev

# Run E2E tests (in separate terminal)
pnpm test
```

### **Test Files**

- E2E tests: `packages/cypress-e2e/cypress/e2e/apps/web/`
- Component tests: Add in `__tests__/` directories

## 🆘 Troubleshooting

### **Common Issues**

1. **Clerk Authentication Not Working**:
   ```bash
   # Check environment variables
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   echo $CLERK_SECRET_KEY
   
   # Verify allowed domains in Clerk dashboard
   # Development: localhost:3001
   # Production: your-domain.com
   ```

2. **Database Connection Failed**:
   ```bash
   # Check DATABASE_URL format
   # SQLite: file:./dev.db
   # PostgreSQL: postgresql://user:pass@host:port/db
   
   # Regenerate Prisma client
   pnpm db:generate
   ```

3. **Build Errors**:
   ```bash
   # Check TypeScript errors
   pnpm typecheck
   
   # Check linting
   pnpm lint
   ```

4. **Environment Variables Not Loading**:
   ```bash
   # Ensure .env.local is in project root
   # Restart development server after changes
   pnpm dev
   ```

## 📚 Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Clerk Authentication](https://clerk.com/docs/nextjs)
- [Prisma ORM](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)