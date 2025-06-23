# Path Aliases Setup

This monorepo uses path aliases for clean, consistent imports across all apps.

## Available Aliases

- `@components/*` - UI components with default exports
- `@containers/*` - Container components that manage state
- `@providers/*` - React context providers
- `@lib/*` - Library functions and API clients
- `@utils/*` - Utility functions and helpers

## Usage Examples

```typescript
// Components (default exports)
import Button from '@components/Button'
import Modal from '@components/Modal'

// Containers (default exports)
import UserContainer from '@containers/UserContainer'
import PostContainer from '@containers/PostContainer'

// Providers (default exports)
import ThemeProvider from '@providers/ThemeProvider'
import AuthProvider from '@providers/AuthProvider'

// Library functions
import apiClient from '@lib/api'
import { validateUser } from '@lib/validation'

// Utilities
import dateUtils from '@utils/date'
import { formatCurrency } from '@utils/formatting'
```

## Directory Structure

```
apps/web/
├── components/     # Reusable UI components
├── containers/     # Stateful container components
├── providers/      # React context providers
├── lib/           # Library code, API clients
└── utils/         # Pure utility functions

apps/docs/
├── components/     # Same structure
├── containers/
├── providers/
├── lib/
└── utils/
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