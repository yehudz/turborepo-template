# Cypress E2E Testing Suite

Global end-to-end testing package for all apps in the monorepo.

## Prerequisites

**IMPORTANT**: Before running tests, ensure both apps are running:

```bash
# From the root directory
pnpm dev
```

This will start:
- Docs app: http://localhost:3000
- Web app: http://localhost:3001

**The tests will fail if the apps are not running!**

## Running Tests

```bash
# Run all E2E tests
pnpm test

# Run specific app tests
pnpm test:web    # Web app tests only
pnpm test:docs   # Docs app tests only
pnpm test:shared # Cross-app tests

# Open Cypress UI
pnpm test:open
```

## Test Structure

```
cypress/
├── e2e/
│   ├── apps/
│   │   ├── web/     # Web app specific tests
│   │   └── docs/    # Docs app specific tests
│   └── shared/      # Cross-app integration tests
├── support/
│   ├── commands.ts  # Custom Cypress commands
│   └── e2e.ts      # Global configuration
└── fixtures/        # Test data
```

## Custom Commands

- `cy.visitApp('web' | 'docs')` - Visit app with error handling
- `cy.checkResponsive()` - Test responsive design across viewports