# @repo/types

Centralized TypeScript type definitions for the entire monorepo.

## Purpose

This package contains all shared types used across apps and packages in the monorepo, ensuring type consistency and preventing duplication.

## Naming Convention

- **Interfaces**: Suffix with `I` (e.g., `UserI`, `ApiResponseI`)
- **Types**: Suffix with `T` (e.g., `IDT`, `StatusT`) 
- **Enums**: Suffix with `E` (e.g., `StatusE`, `UserRoleE`)

## Usage

```typescript
import { UserI, ApiResponseI, StatusE, ButtonVariantE, IDT } from '@repo/types'

// Use interfaces for object shapes
const user: UserI = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: UserRoleE.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Use interfaces for API responses
const response: ApiResponseI<UserI[]> = {
  data: [user],
  message: 'Users fetched successfully',
  status: StatusE.SUCCESS,
}

// Use enums for better type safety
const buttonVariant = ButtonVariantE.PRIMARY
```

## Organization

### Interfaces (`interfaces.ts`)
- `BaseEntityI` - Base entity with common fields
- `ApiResponseI<T>` - Standardized API response format
- `UserI` - User entity
- `ToastMessageI` - Notification types
- All object shape definitions

### Types (`types.ts`)
- `IDT` - Universal identifier type
- Type aliases and union types

### Enums (`enums.ts`)
- `StatusE` - Loading/response states
- `UserRoleE` - User permission levels
- `ButtonVariantE` - UI component variants
- All enumerated values

## Adding New Types

1. Choose the correct category:
   - **Interface** for object shapes → `interfaces.ts`
   - **Type alias** for unions/primitives → `types.ts` 
   - **Enum** for fixed sets of values → `enums.ts`

2. Follow naming convention (`I`, `T`, or `E` suffix)

3. Add to the appropriate file

4. Run `pnpm build` to compile

## Building

```bash
# Build types package
pnpm build

# Watch mode for development
pnpm dev

# Type check only
pnpm typecheck
```