# Turborepo Template with TypeScript, Tailwind CSS, Clerk Auth & Prisma

A production-ready turborepo template with authentication, database, and CI/CD setup for Google Cloud Platform (GCP).

## 🚀 What's Inside

This template includes:

- **Apps:**
  - `web` - Next.js 15 app with Clerk authentication
  - `docs` - Next.js 15 documentation app
- **Packages:**
  - `@repo/ui` - Shared React components with Tailwind CSS
  - `@repo/auth` - Clerk authentication configuration
  - `@repo/database` - Prisma ORM with PostgreSQL
  - `@repo/env` - Environment variable validation
  - `@repo/types` - Shared TypeScript types
  - `@repo/constants` - Shared constants
  - `@repo/cypress-e2e` - End-to-end testing

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker (for database)
- Google Cloud CLI (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd <your-project-name>
pnpm install
```

### 2. 🔐 Create Environment File

```bash
# REQUIRED: Copy template and add your actual values
cp .env.example .env.local
```

**Then open `.env.local` and replace the placeholder values with real ones (see step 3 below).**

### 3. ⚠️ **CRITICAL**: Update Package Names

**You MUST update these before starting development:**

1. **Root package.json** - Change project name:
```json
{
  "name": "your-project-name"  // Change from "with-tailwind"
}
```

2. **Update workspace package names** in each `package.json`:
```bash
# Find all package.json files and update @repo/* names
packages/*/package.json
apps/*/package.json
```

### 4. 🔐 Environment Variables Setup

#### **🚨 MUST UPDATE - Environment Variables**

| Variable | Location | Description | How to Get |
|----------|----------|-------------|------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` | Clerk auth public key | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
| `CLERK_SECRET_KEY` | `.env.local` | Clerk auth secret key | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
| `DATABASE_URL` | `.env.local` | PostgreSQL connection string | See Database Setup below |
| `NEXT_PUBLIC_APP_URL` | `.env.local` | Your app URL | `http://localhost:3000` (dev) or your domain |
| `NEXT_PUBLIC_API_URL` | `.env.local` | Your API URL | `http://localhost:3000/api` (dev) or your API domain |
| `JWT_SECRET` | `.env.local` | JWT signing secret | Generate: `openssl rand -base64 32` |

### 5. 🗃️ Database Setup

#### **Local Development (SQLite)**
```bash
# Uses file-based SQLite (default)
DATABASE_URL="file:./dev.db"
pnpm db:generate
pnpm db:push
```

#### **Production (PostgreSQL)**
```bash
# Update DATABASE_URL to PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database"
pnpm db:generate  
pnpm db:migrate
```

### 6. 🔧 Authentication Setup (Clerk)

1. **Create Clerk Account**: [https://clerk.com](https://clerk.com)
2. **Create Application** in Clerk Dashboard
3. **Copy API Keys** to your `.env.local`
4. **Configure Allowed Domains**:
   - Development: `localhost:3000`, `localhost:3001`
   - Production: Your actual domains

### 7. 🚀 Development

```bash
# Validate environment variables (recommended first step)
pnpm validate-env

# Quick setup: validate env + generate database
pnpm setup

# Start all apps and packages in development mode
pnpm dev

# Run tests (requires dev servers to be running)
pnpm test

# Build for production
pnpm build

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## 📝 Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/your-feature
   pnpm dev  # Start development servers
   # Make changes
   pnpm test  # Run tests
   pnpm lint  # Check code quality
   ```

2. **Testing**:
   ```bash
   # Terminal 1: Keep dev servers running
   pnpm dev
   
   # Terminal 2: Run tests
   pnpm test
   ```

3. **Deployment**:
   ```bash
   git push origin main  # Triggers CI/CD pipeline
   ```

## 🏗️ Infrastructure & Deployment

For GCP deployment, Cloud Build setup, and infrastructure configuration, see:

- **Infrastructure Documentation**: `infrastructure/README.md`
- **Terraform Configurations**: `infrastructure/terraform/`
- **Docker Configurations**: `Dockerfile` in each app
- **CI/CD Pipeline**: `infrastructure/cloudbuild.yaml`

## 🚨 **CHECKLIST: What to Update Before Going Live**

- [ ] Update project name in root `package.json`
- [ ] Update all `@repo/*` package names
- [ ] Set up Clerk account and update auth keys
- [ ] Configure production database connection string
- [ ] Update environment variables for production
- [ ] Follow infrastructure setup guide in `infrastructure/README.md`
- [ ] Update app URLs in environment variables
- [ ] Test deployment pipeline
- [ ] Update domain names and SSL certificates

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Troubleshooting

### Common Issues:

1. **Environment variables not loaded**: Ensure `.env.local` is in the root directory
2. **Database connection failed**: Check `DATABASE_URL` format and credentials
3. **Clerk authentication errors**: Verify API keys and allowed domains
4. **Build failures**: Check TypeScript errors with `pnpm typecheck`
5. **Tests failing**: Ensure dev servers are running before running tests

### Getting Help:

- Check the specific app READMEs in `apps/web/README.md` and `apps/docs/README.md`
- Review package documentation in `packages/*/README.md`
- Check environment variable validation in `packages/env/src/`
- Review infrastructure setup in `infrastructure/README.md`