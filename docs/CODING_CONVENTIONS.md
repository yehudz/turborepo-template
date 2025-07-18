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

1. **UI Components** → Check `@repo/ui` package first
2. **Database Operations** → Use `@repo/database` package (never install `@prisma/client` directly)
3. **Authentication** → Use `@repo/auth` package
4. **Types** → Check `@repo/types` package
5. **Constants** → Use `@repo/constants` package
6. **Utilities** → Check `@repo/ui/lib/utils` or create in appropriate package

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

// ✅ REQUIRED - Use existing UI package
import { Button } from '@repo/ui'
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

## Summary - Core Principles

1. **NO `any` types** - Everything must be properly typed with suffix naming
2. **ALWAYS check packages first** - Don't reinvent the wheel
3. **Import organization** - Follow the exact grouping and order
4. **Server-first** - Minimize client components and hooks
5. **Context API** - Only state management solution allowed

## Enforcement

These conventions are **mandatory** and will be enforced through:
- ESLint rules
- Code reviews
- Automated checks
- Build pipeline validation

**Remember: ALWAYS prioritize server over client, and NO `any` in types!**