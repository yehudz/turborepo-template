# Coding Conventions

This document outlines the mandatory coding standards and conventions for this project. **All contributors must follow these rules without exception.**

## 1. Type Safety - NO `any` Types

- **PROHIBITED**: Using `any` type anywhere in the codebase
- **REQUIRED**: All new types must be created in the `@repo/types` package
- **NAMING**: All types must end with their type suffix:
  - Interfaces: `MyInterfaceI`
  - Types: `MyTypeT`
  - Enums: `MyEnumE`
- **RULE**: Every function, variable, and component must have explicit TypeScript types

```typescript
// ❌ PROHIBITED
function handleData(data: any) {
  return data.something;
}

// ✅ REQUIRED
interface UserDataI {
  id: string;
  name: string;
  email: string;
}

type UserStatusT = 'active' | 'inactive' | 'pending'

enum UserRoleE {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

function handleData(data: UserDataI) {
  return data.name;
}
```

## 2. Package Reuse - Check Existing Implementations

**ALWAYS ALWAYS ALWAYS** check the `packages/` folder before creating new implementations.

### Before Creating Anything New:

1. **UI Components** → Check `@repo/ui` package first (Shadcn/ui components)
2. **Database Operations** → Use `@repo/database` package (PostgreSQL only, never install `@prisma/client` directly)
3. **Authentication** → Use `@repo/auth` package
4. **Types** → Check `@repo/types` package
5. **Constants** → Use `@repo/constants` package
6. **Utilities** → Use `cn` from `@repo/ui` for className merging, check other utilities in packages

### Examples:

```typescript
// ❌ PROHIBITED - Installing new dependencies
import { PrismaClient } from '@prisma/client'

// ✅ REQUIRED - Use existing package
import { prisma } from '@repo/database'
```

```typescript
// ❌ PROHIBITED - Creating new button component
const Button = () => <button>Click me</button>

// ✅ REQUIRED - Use existing Shadcn/ui components
import { Button, Card, CardContent } from '@repo/ui'

// ✅ REQUIRED - Use cn utility for className merging
import { cn } from '@repo/ui'
const className = cn("base-class", condition && "conditional-class")
```

## 3. Import Organization

**ALL** imports must be grouped with comments in this **EXACT** order:

```typescript
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { clsx } from 'clsx'

// auth
import { getCurrentUser } from '@repo/auth'

// DS (Design System - UI package)
import { Button, Card, Modal } from '@repo/ui'

// containers
import { UserProfileContainer } from '@/containers/UserProfileContainer'

// components
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'

// constants
import { API_ENDPOINTS } from '@repo/constants'

// utils
import { formatDate } from '@repo/ui/lib/utils'

// types
import type { UserI, UserRoleE } from '@repo/types'
```

### Import Order Rules:
1. **React, Next.js, and third-party libraries** - No comment needed, goes at the top
2. **// auth** - Authentication related imports
3. **// DS** - Design System (UI package)
4. **// containers** - Container components
5. **// components** - Regular components
6. **// constants** - Constants and configuration
7. **// utils** - Utility functions
8. **// types** - TypeScript types and interfaces

## 4. React 19 & Server-First Approach

**ALWAYS prioritize server over client components.**

### Server Components (Default)
```typescript
// ✅ PREFERRED - Server Component
async function UserProfile({ userId }: { userId: string }) {
  const user = await getCurrentUser() // Server-side
  
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  )
}
```

### Client Components (Only When Necessary)
```typescript
'use client'

import { use } from 'react' // React 19 - prefer over useEffect

// ✅ ONLY when absolutely necessary
function UserInteraction() {
  // Use React 19 features instead of old hooks
  const data = use(fetchUserData()) // Instead of useEffect + useState
  
  return <div>{data.name}</div>
}
```

### Rules:
- **Minimize** `useState` and `useEffect`
- **Prefer** React 19 `use` hook
- **Default** to Server Components
- **Only** add `'use client'` when absolutely necessary (user interactions, browser APIs)

## 5. State Management

**REQUIRED**: Use React Context API for all state management.

```typescript
import { createContext, useContext } from 'react'

// types
import type { UserI } from '@repo/types'

interface AppStateI {
  user: UserI | null
  theme: 'light' | 'dark'
}

const AppContext = createContext<AppStateI | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppStateI>({
    user: null,
    theme: 'light'
  })
  
  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used within AppProvider')
  }
  return context
}
```

### State Rules:
- **NO** external state libraries (Redux, Zustand, etc.)
- **USE** React Context API for all global state
- **PREFER** server state over client state
- **MINIMIZE** client-side state management

## 6. Shadcn/ui Component Usage

**REQUIRED**: Use Shadcn/ui components from `@repo/ui` package.

### Component Rules:
- **ALWAYS** import components from `@repo/ui`
- **USE** the `cn` utility for className merging
- **FOLLOW** component composition patterns
- **CUSTOMIZE** via className props, not inline styles

```typescript
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'

// ✅ CORRECT - Using Shadcn components with proper composition
function UserCard({ user, className }: { user: UserI; className?: string }) {
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}

// ❌ PROHIBITED - Creating custom components when Shadcn exists
function CustomButton() {
  return <button className="custom-styles">Click me</button>
}
```

### Adding New Components:
```bash
# Navigate to UI package
cd packages/ui

# Install new Shadcn components
pnpm dlx shadcn@latest add input label form dialog

# Update exports in packages/ui/src/index.ts
export * from './components/ui/input'
export * from './components/ui/label'
```

### Component Variant Usage:
```typescript
// ✅ Use built-in variants
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>

// ✅ Combine with custom classes using cn
<Button className={cn("w-full", isLoading && "opacity-50")}>
  Submit
</Button>
```

## Summary - Core Principles

1. **NO `any` types** - Everything must be properly typed with suffix naming
2. **ALWAYS check packages first** - Don't reinvent the wheel
3. **Import organization** - Follow the exact grouping and order
4. **Server-first** - Minimize client components and hooks
5. **Context API** - Only state management solution allowed
6. **Shadcn/ui components** - Use existing components, follow composition patterns

## 7. Git Commit Conventions

**PROHIBITED**: Adding AI-generated footers to commit messages.

### Commit Message Rules:
- **USE** conventional commit format: `type: description`
- **KEEP** descriptions concise and clear
- **NO** AI-generated footers or co-authorship attributions
- **WRITE** in lowercase for commit types

```bash
# ✅ CORRECT - Clean commit messages
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update api documentation"

# ❌ PROHIBITED - AI-generated footers
git commit -m "feat: add feature

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Commit Types:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Enforcement

These conventions are **mandatory** and will be enforced through:
- ESLint rules
- Code reviews
- Automated checks
- Build pipeline validation

**Remember: ALWAYS prioritize server over client, and NO `any` in types!**