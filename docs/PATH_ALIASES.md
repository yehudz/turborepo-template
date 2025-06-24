# Path Aliases Setup

This monorepo uses path aliases for clean, consistent imports across all apps.

## Available Aliases

- `@components/*` - React components (create this directory as needed)
- `@containers/*` - Container components that manage state (create as needed)
- `@providers/*` - React context providers (create as needed)
- `@lib/*` - Library functions and API clients
- `@utils/*` - Utility functions and helpers (create as needed)

## Usage Examples

```typescript
// Library functions (currently available)
import { apiClient } from '@lib/api'

// Components (create directories as needed)
import Button from '@components/Button'
import Modal from '@components/Modal'

// Containers (create directories as needed)
import UserContainer from '@containers/UserContainer'

// Providers (create directories as needed)
import ThemeProvider from '@providers/ThemeProvider'

// Utilities (create directories as needed)
import { formatCurrency } from '@utils/formatting'
```

## Current Directory Structure

```
apps/web/
├── app/           # Next.js App Router pages
├── lib/           # Library code, API clients (✅ exists)
└── public/        # Static assets

apps/docs/
├── app/           # Next.js App Router pages
├── lib/           # Library code (✅ exists)
└── public/        # Static assets
```

## Creating New Directories

The path aliases are already configured in TypeScript. Simply create the directories as you need them:

```bash
# Add components directory
mkdir apps/web/components
mkdir apps/docs/components

# Add other directories as needed
mkdir apps/web/utils
mkdir apps/web/providers
```

## Configuration

Path aliases are configured in:

1. **TypeScript**: Each app's `tsconfig.json` 
2. **ESLint**: `packages/eslint-config/base.js` with import resolver
3. **Next.js**: Automatically picks up TypeScript paths

## Adding New Files

1. Create your file with a **default export**:

```typescript
// components/NewButton.tsx
export default function NewButton() {
  return <button>New Button</button>
}
```

2. Import using the alias:

```typescript
import NewButton from '@components/NewButton'
```

## Benefits

- **Clean imports** - No more `../../../components`
- **Easy refactoring** - Moving files doesn't break imports
- **Consistent structure** - Same aliases across all apps
- **Better autocomplete** - IDEs can suggest paths
- **Type safety** - ESLint catches invalid imports