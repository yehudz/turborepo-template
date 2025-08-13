# 🚀 Production-Ready Turborepo Template

A plug-and-play monorepo template with **Shadcn/ui**, **Appwrite authentication**, **PostgreSQL**, and **Google Cloud deployment**.

## ⚡ Quick Start (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd <your-project-name>
pnpm install

# 2. Set up environment files
pnpm setup:env

# 3. Update .env.local with your Appwrite project ID (see Appwrite setup below)

# 4. Start Docker Postgres
docker-compose up postgres -d

# 5. Set up database
pnpm db:generate
pnpm db:push

# 6. Validate setup
pnpm validate-env

# 7. Start development
pnpm dev
```

**🎉 Your apps are now running:**
- Web app: http://localhost:3001
- Admin app: http://localhost:3000

## 📋 What's Inside

### **Apps:**
- `web` - Next.js 15 app with Appwrite auth (port 3001)
- `admin` - Next.js 15 admin dashboard (port 3000)  
- `api` - Express.js API server

### **Packages:**
- `@repo/ui` - Shadcn/ui components with Tailwind CSS v4
- `@repo/auth` - Appwrite authentication (client + server)
- `@repo/database` - Prisma ORM with PostgreSQL
- `@repo/env` - Environment variable validation
- `@repo/types` - Shared TypeScript types
- `@repo/constants` - Application constants

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js 18+** 
- **pnpm 8+**
- **Docker** (for PostgreSQL)

### 1. Environment Setup

Create environment files:
```bash
# This creates both .env.local and packages/database/.env.local
pnpm setup:env
```

Your `.env.local` will contain:
```bash
# Database - matches Docker Postgres credentials
DATABASE_URL="postgresql://app_user:dev_password@localhost:5432/app_db"

# Appwrite Authentication (get from https://cloud.appwrite.io/console)
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your_project_id_here"
NEXT_PUBLIC_APPWRITE_URL="https://cloud.appwrite.io/v1"

NODE_ENV="development"
```

### 2. Appwrite Authentication Setup

1. **Create account**: Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)

2. **Create new project**: 
   - Click "Create Project"
   - Name your project (e.g., "My App")
   - Copy the **Project ID** (looks like: `507f1f77bcf86cd799439011`)

3. **Update environment**:
   ```bash
   # In .env.local - replace the placeholder
   NEXT_PUBLIC_APPWRITE_PROJECT_ID="507f1f77bcf86cd799439011"
   ```

4. **Configure domains** (in Appwrite console):
   - Go to your project → Settings → Platforms
   - Add Web platform: `http://localhost:3001`
   - Add Web platform: `http://localhost:3000`

### 3. GitHub Deployment Setup (Optional - for auto-deployment)

If you want automatic deployment to Google Cloud Platform via GitHub Actions, add these variables to your **environment configuration**:

**📋 Required Variables for Auto-Deployment:**

Add these to your `infrastructure/terraform.tfvars` file:

```bash
# GitHub Repository (for Workload Identity Federation)
# Format: "your-github-username/your-repo-name" 
github_repository = "yourusername/your-repo-name"

# GitHub Organization/User (for repository access)
github_owner = "yourusername"
```

**💡 How to find your values:**
- `github_repository`: Look at your GitHub URL: `https://github.com/USERNAME/REPO-NAME`
- `github_owner`: Your GitHub username or organization name

**🔧 These variables enable:**
- ✅ Keyless authentication (no service account keys needed)
- ✅ Automatic deployment on git push to main
- ✅ Secure, repository-specific access to Google Cloud
- ✅ Separate dev/prod environment isolation

**📖 Full deployment guide**: `docs/GITHUB_DEPLOYMENT_SETUP.md`

---

### 4. Database Setup (Docker PostgreSQL)

Start PostgreSQL:
```bash
# Start Postgres in background
docker-compose up postgres -d

# Verify it's running
docker-compose logs postgres
```

Set up the database:
```bash
# Generate Prisma client for @repo/database package
pnpm db:generate

# Create tables in database
pnpm db:push
```

### 4. Validate Setup

```bash
# Check everything is configured correctly
pnpm validate-env
```

This will verify:
- ✅ Environment variables are set
- ✅ Appwrite project ID format
- ✅ Database URL format

### 5. Start Development

```bash
# Start all apps
pnpm dev
```

**Your applications:**
- **Web App**: http://localhost:3001 (main application)
- **Admin App**: http://localhost:3000 (admin dashboard)

## 🔧 Available Scripts

### Root Scripts
- `pnpm dev` - Start all apps in development
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages
- `pnpm validate-env` - Validate environment setup
- `pnpm setup:env` - Create environment files from template

### Database Scripts (Prisma in @repo/database package)
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:migrate` - Create and apply migration (production)
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:reset` - Reset database (⚠️ destructive)

### Adding Shadcn Components
```bash
# Navigate to UI package
cd packages/ui

# Add new components
pnpm dlx shadcn@latest add input label form dialog

# Export in packages/ui/src/index.ts
export * from './components/ui/input'
export * from './components/ui/label'
```

## 🐳 Docker Development

### Database Only (Recommended)
```bash
# Start just PostgreSQL
docker-compose up postgres -d

# View logs
docker-compose logs -f postgres

# Stop
docker-compose down
```

### Full Stack with Docker
```bash
# Start everything (Postgres + Apps)
docker-compose up

# Stop services
docker-compose down

# Reset database (removes data)
docker-compose down -v
```

## 🚨 Troubleshooting

### Common Issues

**Environment not loading:**
```bash
# Recreate environment files
pnpm setup:env
# Edit .env.local with your Appwrite project ID
pnpm validate-env
```

**Database connection failed:**
```bash
# Check Postgres is running
docker-compose ps

# Check connection
docker-compose exec postgres psql -U app_user -d app_db -c "SELECT 1;"

# If connection fails, restart Postgres
docker-compose restart postgres
```

**Appwrite authentication issues:**
```bash
# Verify project ID (should be 20+ characters)
echo $NEXT_PUBLIC_APPWRITE_PROJECT_ID

# Test Appwrite connection
curl https://cloud.appwrite.io/v1/health
```

**Database schema issues:**
```bash
# Reset and recreate database
pnpm db:reset
pnpm db:push
```

**Build failures:**
```bash
# Clear everything and reinstall
docker-compose down
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install
pnpm db:generate
pnpm build
```

### Complete Reset (Nuclear Option)
```bash
# Reset everything
docker-compose down -v
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm .env.local packages/database/.env.local
pnpm install
pnpm setup:env
# Edit .env.local with your Appwrite project ID
docker-compose up postgres -d
pnpm db:generate
pnpm db:push
pnpm validate-env
pnpm dev
```

## 🌟 Features

- **TypeScript** - Strict mode, no `any` types allowed
- **Shadcn/ui** - Modern component library with Radix UI primitives
- **Appwrite Auth** - Production-ready authentication with session management
- **PostgreSQL** - Robust relational database with Prisma ORM
- **Docker** - Containerized development environment
- **Turborepo** - Optimized build system with intelligent caching
- **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- **GitHub Actions** - Automated CI/CD pipeline for Google Cloud

## 🚀 Deployment (3-Command Setup)

Deploy to Google Cloud Platform with **keyless authentication**:

```bash
# 1. Add GitHub variables to infrastructure/terraform.tfvars
#    (see "GitHub Deployment Setup" section above)

# 2. Deploy infrastructure with auto-configured GitHub Actions
cd infrastructure
terraform init
terraform apply

# 3. Push to main branch - auto-deploys! 🚀
git push origin main
```

**🔧 What happens automatically:**
- ✅ Google Cloud infrastructure provisioned
- ✅ Workload Identity Federation configured (no service account keys!)
- ✅ GitHub repository secrets automatically set
- ✅ Push to `main` → deploys to production
- ✅ Push to `dev` → deploys to development environment

**📖 Full setup guide**: `docs/GITHUB_DEPLOYMENT_SETUP.md`

## 📖 Documentation

- **Architecture Overview**: `docs/ARCHITECTURE.md`
- **Coding Standards**: `docs/CODING_CONVENTIONS.md` 
- **Deployment Guide**: `docs/GITHUB_DEPLOYMENT_SETUP.md`
- **Path Aliases**: `docs/PATH_ALIASES.md`

## 💡 Development Tips

- **Start with validation**: Always run `pnpm validate-env` after changes
- **Database first**: Ensure Postgres is running before starting apps
- **Environment consistency**: DATABASE_URL must be the same in both `.env.local` files
- **Component reuse**: Check `@repo/ui` before creating new components
- **Clean commits**: Follow conventional commit format (see `docs/CODING_CONVENTIONS.md`)

---

**🎉 Happy coding!** For issues or questions, check the `docs/` folder or create an issue.