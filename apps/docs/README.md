# Docs App - Next.js Documentation Site

A documentation website built with Next.js for project documentation, guides, and API references.

## 🚀 Features

- **Static Site Generation**: Pre-rendered pages for fast loading
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Component Documentation**: Showcase of shared UI components
- **API Documentation**: Auto-generated API docs
- **Search Functionality**: Built-in search across documentation

## 🔧 Configuration

### **Environment Variables**

This app requires minimal environment variables in the root `.env.local`:

```bash
# App URLs (REQUIRED for production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # This app's URL

# Optional: If docs need to reference the main web app
NEXT_PUBLIC_WEB_APP_URL="http://localhost:3001"  # Web app URL
```

### **🚨 MUST UPDATE Before Development**

1. **Production URLs**:
   ```bash
   # Update these with your actual domain
   NEXT_PUBLIC_APP_URL="https://docs.yourapp.com"
   NEXT_PUBLIC_WEB_APP_URL="https://yourapp.com"
   ```

2. **Site Configuration**:
   ```typescript
   // Update site metadata in app/layout.tsx
   export const metadata = {
     title: "Your App Documentation",  // Change from "Create Turborepo"
     description: "Documentation for Your App"  // Change from generic description
   }
   ```

## 🛠️ Development

### **Start Development Server**

```bash
# From project root
pnpm dev

# Or run just this app
cd apps/docs
pnpm dev
```

The docs site will be available at `http://localhost:3000`

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
apps/docs/
├── app/                    # Next.js App Router
│   ├── components/         # Component documentation
│   ├── guides/            # User guides
│   ├── api-reference/     # API documentation
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Documentation-specific UI
│   ├── code-block/       # Code syntax highlighting
│   └── navigation/       # Site navigation
├── lib/                  # Utility functions
│   ├── mdx.ts           # MDX processing
│   ├── search.ts        # Search functionality
│   └── utils.ts         # General utilities
├── content/              # MDX/Markdown content
│   ├── guides/          # User guides
│   └── api/             # API documentation
├── next.config.js        # Next.js configuration
└── package.json          # App dependencies
```

## 📝 Content Management

### **Adding Documentation Pages**

1. **Create MDX files** in the `content/` directory:

```mdx
// content/guides/getting-started.mdx
---
title: "Getting Started"
description: "Learn how to set up and use the app"
---

# Getting Started

Your documentation content here...
```

2. **Add to navigation** in `components/navigation/`:

```typescript
export const navigationItems = [
  {
    title: "Guides",
    items: [
      { title: "Getting Started", href: "/guides/getting-started" },
      { title: "Advanced Usage", href: "/guides/advanced" }
    ]
  }
]
```

### **Component Documentation**

Document shared components from `@repo/ui`:

```mdx
// content/components/button.mdx
---
title: "Button Component"
description: "Versatile button component with multiple variants"
---

import { Button } from "@repo/ui"

# Button Component

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "primary" | Button style variant |
| size | string | "md" | Button size |
```

### **API Documentation**

Document API endpoints:

```mdx
// content/api/auth.mdx
---
title: "Authentication API"
description: "Endpoints for user authentication"
---

# Authentication API

## POST /api/auth/login

Authenticate a user and return a session token.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```
```

## 🎨 Styling & UI

### **Tailwind CSS**
- Shared design system from `@repo/ui`
- Documentation-specific styles
- Dark/light mode support
- Responsive typography

### **Component Usage**

```typescript
import { Card, Button } from "@repo/ui"
import { CodeBlock } from "@/components/code-block"

export default function DocPage() {
  return (
    <Card>
      <h2>Example</h2>
      <CodeBlock language="typescript">
        {`const example = "Hello World"`}
      </CodeBlock>
      <Button>View More</Button>
    </Card>
  )
}
```

## 🔍 Search Functionality

### **Setting Up Search**

1. **Configure search** in `lib/search.ts`:

```typescript
export const searchConfig = {
  // Add searchable content sources
  sources: ['guides', 'api-reference', 'components'],
  // Configure search options
  options: {
    threshold: 0.6,
    keys: ['title', 'description', 'content']
  }
}
```

2. **Add search component**:

```typescript
import { Search } from "@/components/search"

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <Search />
      </nav>
      {children}
    </div>
  )
}
```

## 🚀 Deployment

### **Static Export** (Recommended for docs)

```bash
# Configure next.config.js for static export
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# Build static site
pnpm build
```

### **Production Environment Variables**

```bash
# Production URLs
NEXT_PUBLIC_APP_URL="https://docs.yourapp.com"
NEXT_PUBLIC_WEB_APP_URL="https://yourapp.com"

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS="GA_MEASUREMENT_ID"
```

### **Deployment Options**

1. **Vercel** (Recommended):
   ```bash
   # Deploy with Vercel CLI
   npx vercel
   ```

2. **Netlify**:
   ```bash
   # Build command: pnpm build
   # Publish directory: out (for static export)
   ```

3. **GCP Cloud Storage** (Static hosting):
   ```bash
   # Upload build output to GCS bucket
   gsutil -m cp -r out/* gs://your-docs-bucket/
   ```

### **Deployment Checklist**

- [ ] Update site metadata and branding
- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test all documentation links
- [ ] Verify search functionality
- [ ] Check mobile responsiveness

## 🧪 Testing

### **Running Tests**

```bash
# Start dev server first
pnpm dev

# Run E2E tests (in separate terminal)
pnpm test
```

### **Test Files**

- E2E tests: `packages/cypress-e2e/cypress/e2e/apps/docs/`
- Content validation: Add tests for broken links
- Component tests: Test documentation components

## 📚 Content Guidelines

### **Writing Documentation**

1. **Clear Structure**: Use consistent headings and sections
2. **Code Examples**: Include practical, working examples
3. **Screenshots**: Add visual guides where helpful
4. **Cross-References**: Link between related documentation
5. **Keep Updated**: Review and update docs regularly

### **Content Organization**

```
content/
├── guides/              # User-facing guides
│   ├── getting-started.mdx
│   ├── configuration.mdx
│   └── troubleshooting.mdx
├── api-reference/       # API documentation
│   ├── authentication.mdx
│   ├── endpoints.mdx
│   └── webhooks.mdx
└── components/          # Component documentation
    ├── button.mdx
    ├── card.mdx
    └── form.mdx
```

## 🆘 Troubleshooting

### **Common Issues**

1. **MDX Not Rendering**:
   ```bash
   # Check MDX configuration in next.config.js
   # Verify frontmatter format
   # Check for syntax errors in MDX files
   ```

2. **Navigation Not Working**:
   ```bash
   # Verify navigation configuration
   # Check file paths and routes
   # Ensure pages exist for navigation items
   ```

3. **Search Not Finding Content**:
   ```bash
   # Rebuild search index
   # Check search configuration
   # Verify content is properly indexed
   ```

4. **Styles Not Loading**:
   ```bash
   # Check Tailwind CSS configuration
   # Verify shared UI components are imported
   # Restart development server
   ```

## 🔧 Customization

### **Theming**

```typescript
// Customize documentation theme
export const docsTheme = {
  colors: {
    primary: '#your-brand-color',
    secondary: '#your-secondary-color'
  },
  fonts: {
    heading: 'Your-Font-Family',
    body: 'Your-Body-Font'
  }
}
```

### **Navigation**

```typescript
// Customize site navigation
export const navigation = [
  {
    title: "Getting Started",
    href: "/guides/getting-started"
  },
  {
    title: "API Reference",
    href: "/api-reference",
    children: [
      { title: "Authentication", href: "/api-reference/auth" },
      { title: "Users", href: "/api-reference/users" }
    ]
  }
]
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation Best Practices](https://www.writethedocs.org/)