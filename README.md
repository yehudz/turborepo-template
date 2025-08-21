# 🚀 Enterprise Turborepo Template

**The complete full-stack template for modern web and mobile applications.** From local development to production deployment in 15 minutes.

✅ **Next.js 15** + **React 19** + **TypeScript**  
✅ **Shadcn/ui** design system + **Tailwind CSS v4**  
✅ **Cross-platform mobile apps** with **Capacitor** (iOS & Android)  
✅ **Appwrite authentication** + **PostgreSQL database**  
✅ **Google Cloud deployment** with **manual CI/CD approval**  
✅ **Complete automation** - one-command setup  

---

## 🎯 Complete Setup Guide

Follow these **exact steps** to go from zero to deployed enterprise application.

### Prerequisites

**Install these first (5 minutes):**

1. **Docker Desktop** (for local database):
   ```bash
   # Download and install from:
   open https://docker.com/desktop
   ```

2. **Node.js 20**:
   ```bash
   # Download and install from:
   open https://nodejs.org
   ```

3. **pnpm** (package manager):
   ```bash
   npm install -g pnpm
   ```

4. **Git** (should be installed):
   ```bash
   git --version
   ```

---

## Part 1: Authentication Setup (Appwrite)

**Create your authentication backend (3 minutes):**

1. **Create Appwrite account:**
   ```bash
   # Open Appwrite console:
   open https://cloud.appwrite.io
   ```
   - Click "Sign Up" and create free account
   - Verify your email

2. **Create new project:**
   - Click "Create Project"
   - Name: `My Enterprise App` (or your app name)
   - Click "Create"
   - **📋 COPY the Project ID** (looks like: `507f1f77bcf86cd799439011`)

3. **Configure authentication:**
   - In Appwrite Console → **Authentication** → **Settings**
   - **Enable** Email/Password authentication
   - **Save** settings

4. **Authentication is ready:**
   - ✅ **No additional platform configuration needed**
   - Modern Appwrite automatically handles local development domains
   - Your authentication backend is ready to use

**✅ Keep your Project ID handy - you'll need it in the next step!**

---

## Part 2: Local Development Setup

**Set up your development environment (5 minutes):**

1. **Get the code:**
   
   **Option A: Use as GitHub Template (Recommended)**
   - Go to: https://github.com/yehudz/turborepo-template
   - Click the green **"Use this template"** button
   - Choose **"Create a new repository"**
   - Name your repository (e.g., `my-startup-app`)
   - Select **Public** or **Private**
   - Click **"Create repository from template"**
   - Clone your new repository:
     ```bash
     git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
     cd YOUR-REPO-NAME
     ```
   
   **Option B: Fork the Repository**
   - Go to: https://github.com/yehudz/turborepo-template
   - Click **"Fork"** button in the top right
   - Clone your fork:
     ```bash
     git clone https://github.com/YOUR-USERNAME/turborepo-template.git
     cd turborepo-template
     ```

2. **Create environment files:**
   ```bash
   cp .env.example .env.local
   cp .env.local packages/database/.env.local
   ```

3. **Edit environment file:**
   ```bash
   # Open in VS Code:
   code .env.local
   
   # OR open in nano:
   nano .env.local
   ```
   
   **📝 Edit these lines exactly:**
   - **Line 3:** `DATABASE_URL="postgresql://app_user:dev_password@localhost:5432/app_db"`
   - **Line 7:** `NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-project-id-from-step-1"`
   - **Line 8:** `NEXT_PUBLIC_APPWRITE_URL="https://cloud.appwrite.io/v1"`
   
   **Save and close the file.**

4. **Start local database:**
   ```bash
   docker-compose up postgres -d
   ```
   
   **Wait for:** `database system is ready to accept connections`

5. **Install dependencies:**
   ```bash
   pnpm install
   ```

6. **Setup database:**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

7. **Validate setup:**
   ```bash
   pnpm validate-env
   ```
   
   **You should see:** `✅ Environment validation passed!`

8. **Start development servers:**
   ```bash
   pnpm dev
   ```

9. **Choose your development environment:**
   The interactive menu will show:
   - 🌐 **Web only** (admin, web, mobile web, api)
   - 📱 **iOS Simulator** (opens Xcode automatically)
   - 🤖 **Android Emulator** (opens Android Studio automatically)  
   - 📱🤖 **Both mobile apps** (iOS + Android)
   - 🚀 **All apps** (complete development environment)

10. **Access your applications:**
    - **Web app:** http://localhost:3001
    - **Admin app:** http://localhost:3000
    - **Mobile web:** http://localhost:3003
    - **API:** http://localhost:3002

**🎉 Local development is now running!**

---

## 📱 Mobile Development (iOS & Android)

**For native mobile app development, you'll need additional tools:**

### iOS Development (macOS only)
1. **Install Xcode** (from App Store)
2. **Install CocoaPods:**
   ```bash
   # Install Ruby (if needed)
   brew install rbenv ruby-build
   rbenv install 3.2.0 && rbenv global 3.2.0
   
   # Install CocoaPods
   gem install cocoapods
   ```

### Android Development (All platforms)
1. **Install Java 17:**
   ```bash
   brew install openjdk@17
   echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
   ```
2. **Install Android Studio** (from https://developer.android.com/studio)

### Mobile Development Workflow
1. **Choose mobile option in `pnpm dev` menu**
2. **Xcode/Android Studio opens automatically**
3. **Press play button in IDE to run on simulator/emulator**
4. **Live reload works automatically** - changes reflect instantly!

📖 **Complete mobile development guide:** [`docs/MOBILE_DEVELOPMENT.md`](docs/MOBILE_DEVELOPMENT.md)

---

## Part 3: Infrastructure Deployment (Optional)

**Deploy your app to Google Cloud Platform:**

### Option A: Quick Deploy (Prompted Setup)
```bash
./infrastructure/scripts/setup-dev.sh
```
The script will prompt you for all required values.

### Option B: Pre-configured Deploy (Recommended)

1. **Prepare your configuration:**
   ```bash
   cd infrastructure/environments/dev
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars with your values:**
   ```bash
   code terraform.tfvars
   ```
   
   **📝 Update these required values:**
   - `project_id` = Your GCP project ID (e.g., "my-startup-dev-2024")
   - `github_owner` = Your GitHub username
   - `github_repository` = Your repository name  
   - `appwrite_project_id` = Your Appwrite project ID from Part 1
   - `database_password` = **Strong password for PostgreSQL** (e.g., "MySecure-DB-Pass-2024!")
   
   **💡 Important:** Change the database_password from the example value!

3. **Deploy infrastructure:**
   ```bash
   cd ../../..  # Back to project root
   ./infrastructure/scripts/setup-dev.sh
   ```
   
   **The script will:**
   - ✅ Read your terraform.tfvars (no prompts!)
   - ✅ Create GCP Cloud SQL PostgreSQL database
   - ✅ Set up Workload Identity Federation for GitHub Actions
   - ✅ Deploy your infrastructure automatically

**🎉 Your development infrastructure is deployed!**

---

## Part 4: Development Workflow

**How to develop and test locally:**

### Daily Development

1. **Start development (if not running):**
   ```bash
   pnpm dev
   ```

2. **Make your changes** in VS Code or your editor

3. **Create feature branch:**
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

4. **Test your changes** at http://localhost:3001

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   ```

6. **Push to GitHub:**
   ```bash
   git push origin feature/my-awesome-feature
   ```

7. **Create Pull Request** on GitHub

8. **After PR approval, merge to main**

**✅ CI runs automatically on every PR (lint, typecheck, build)**

---

## Part 5: Production Infrastructure Setup

**Deploy to Google Cloud Platform (5 minutes):**

### Prerequisites for Production

1. **Google Cloud account:**
   ```bash
   # Create account at:
   open https://cloud.google.com
   ```

2. **Install Google Cloud CLI:**
   ```bash
   # Download from:
   open https://cloud.google.com/sdk/docs/install
   ```

3. **Install GitHub CLI:**
   ```bash
   # Download from:
   open https://cli.github.com
   ```

4. **Authenticate with Google Cloud:**
   ```bash
   gcloud auth login
   ```

5. **Authenticate with GitHub:**
   ```bash
   gh auth login
   ```

### Development Environment Setup

1. **Navigate to dev environment:**
   ```bash
   cd infrastructure/environments/dev
   ```

2. **Copy terraform template:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Edit terraform variables:**
   ```bash
   code terraform.tfvars
   ```
   
   **📝 Edit these lines:**
   - **Line 8:** `project_id = "my-startup-dev-2024"` (your GCP project ID)
   - **Line 12:** `github_owner = "your-github-username"`
   - **Line 13:** `github_repository = "your-repo-name"`
   - **Line 16:** `appwrite_project_id = "your-appwrite-project-id-from-part-1"`
   
   **Save and close the file.**

4. **Return to project root:**
   ```bash
   cd ../../..
   ```

5. **Run automated setup:**
   ```bash
   ./infrastructure/scripts/setup-dev.sh
   ```
   
   **Follow the prompts:**
   - When asked for GCP Project ID: `my-startup-dev-2024`
   - When asked for Appwrite Project ID: `your-appwrite-project-id`
   - Type `y` to confirm deployment
   
   **Wait for:** `✅ Dev environment ready!`

**🎉 Your development infrastructure is deployed!**

### Production Environment Setup (Optional)

1. **Navigate to prod environment:**
   ```bash
   cd infrastructure/environments/prod
   ```

2. **Copy terraform template:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Edit terraform variables:**
   ```bash
   code terraform.tfvars
   ```
   
   **📝 Edit these lines:**
   - **Line 8:** `project_id = "my-startup-prod-2024"` (separate production project)
   - **Line 12:** `github_owner = "your-github-username"`
   - **Line 13:** `github_repository = "your-repo-name"`
   - **Line 16:** `appwrite_project_id = "your-prod-appwrite-project-id"` (separate production Appwrite)
   - **Line 20:** `alert_email = "alerts@yourcompany.com"` (for production monitoring)
   
   **Save and close the file.**

4. **Return to project root:**
   ```bash
   cd ../../..
   ```

5. **Run production setup:**
   ```bash
   ./infrastructure/scripts/setup-prod.sh
   ```
   
   **Follow the production warnings and confirmations**
   
   **Wait for:** `✅ Production environment ready!`

---

## Part 6: Deploy Your Application

**Manual deployment with approval (enterprise-grade):**

### Deploy to Development

1. **Go to GitHub Actions:**
   ```bash
   # Open your repository:
   open https://github.com/your-username/your-repo-name/actions
   ```

2. **Start deployment:**
   - Click **"Deploy Application"** workflow
   - Click **"Run workflow"** button
   - Select **"dev"** from Environment dropdown
   - Type **"DEPLOY"** in confirmation field (exactly like that)
   - Click **"Run workflow"**

3. **Monitor deployment:**
   - Watch the workflow progress
   - Wait for green ✅ checkmark
   - Click on the run to see deployment URL

4. **Access your deployed app:**
   - Copy the URL from the deployment logs
   - Your app is live! 🎉

### Deploy to Production

1. **Same process as dev, but:**
   - Select **"prod"** from Environment dropdown
   - **Extra confirmations** will be required
   - **Production resources** will be used (higher cost)

2. **Production features:**
   - Always-warm instances (no cold starts)
   - Higher memory and CPU allocation
   - Automated backups
   - Email monitoring alerts

---

## Part 7: Complete Workflow Summary

**Your enterprise development workflow:**

### Local Development
```bash
# Daily development
pnpm dev                    # Start local development
# Make changes, test at localhost:3001
git checkout -b feature/x   # Create feature branch
git push origin feature/x   # Push changes
# Create PR on GitHub → CI runs automatically
```

### Manual Deployment
```bash
# After PR merged to main:
# 1. Go to GitHub → Actions
# 2. Click "Deploy Application"
# 3. Select environment (dev/prod)
# 4. Type "DEPLOY"
# 5. Click "Run workflow"
```

### No Automatic Deployments
- ✅ **Merging to main** = NO deployment (safe)
- ✅ **Manual approval** required for all deployments
- ✅ **Environment selection** (dev vs prod)
- ✅ **Professional workflow** for enterprise teams

---

## 🔧 Available Commands

### Development Commands
```bash
pnpm dev                 # Interactive menu: web, mobile (iOS/Android), or all apps
pnpm build              # Build all apps for production
pnpm lint               # Lint all packages
pnpm typecheck          # Type check all packages
pnpm validate-env       # Validate environment setup
```

### Mobile Development Commands
```bash
cd apps/mobile
pnpm dev                # Start mobile Next.js server
pnpm dev:ios            # Run on iOS Simulator with live reload
pnpm dev:android        # Run on Android Emulator with live reload
pnpm build              # Build mobile app and sync with native platforms
npx cap open ios        # Open iOS project in Xcode
npx cap open android    # Open Android project in Android Studio
```

### Database Commands
```bash
pnpm db:generate        # Generate Prisma client
pnpm db:push           # Push schema to database (development)
pnpm db:migrate        # Create and apply migration (production)
pnpm db:studio         # Open Prisma Studio (database UI)
pnpm db:seed           # Seed database with sample data
pnpm db:reset          # Reset database (⚠️ destructive)
```

### Infrastructure Commands
```bash
./infrastructure/scripts/setup-dev.sh    # Setup development environment
./infrastructure/scripts/setup-prod.sh   # Setup production environment
./infrastructure/scripts/validate-scripts.sh  # Test scripts without deployment
```

### Docker Commands
```bash
docker-compose up postgres -d    # Start database only
docker-compose up               # Start all services
docker-compose down             # Stop all services
docker-compose logs postgres    # View database logs
```

---

## 📋 What's Inside This Template

### Applications
- **`apps/web`** - Main user-facing Next.js app (port 3001)
- **`apps/admin`** - Administrative dashboard (port 3000)
- **`apps/api`** - Express.js API server

### Shared Packages
- **`@repo/ui`** - Shadcn/ui components with Tailwind CSS v4
- **`@repo/auth`** - Appwrite authentication (client + server)
- **`@repo/database`** - Prisma ORM with PostgreSQL
- **`@repo/env`** - Environment variable validation
- **`@repo/types`** - Shared TypeScript types
- **`@repo/constants`** - Application constants

### Infrastructure
- **Google Cloud Run** - Application hosting
- **Google Cloud SQL** - PostgreSQL database
- **Google Secret Manager** - Secure secret storage
- **Workload Identity Federation** - Keyless authentication
- **Artifact Registry** - Docker image storage

### CI/CD Features
- **Manual approval** workflow (no automatic deployments)
- **Environment selection** (dev/prod)
- **Automated testing** (lint, typecheck, build)
- **Security scanning** and dependency auditing
- **Environment isolation** with different resource configurations

---

## 🚨 Troubleshooting

### Local Development Issues

**Environment variables not loading:**
```bash
# Recreate environment file
cp .env.example .env.local
code .env.local
# Add your Appwrite project ID and save
pnpm validate-env
```

**Database connection failed:**
```bash
# Check if Docker is running
docker --version

# Check if Postgres is running
docker-compose ps

# Restart Postgres
docker-compose down
docker-compose up postgres -d

# Check logs
docker-compose logs postgres
```

**Appwrite authentication not working:**
```bash
# Verify your project ID in .env.local
cat .env.local | grep APPWRITE

# Check Appwrite console domains:
# Settings → Platforms → Web platforms should include:
# - http://localhost:3001
# - http://localhost:3000
```

**pnpm install fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Deployment Issues

**GCP authentication failed:**
```bash
# Re-authenticate
gcloud auth login
gcloud config set project your-project-id

# Check active account
gcloud auth list
```

**GitHub CLI not working:**
```bash
# Re-authenticate
gh auth login
gh auth status

# Check repository access
gh repo view your-username/your-repo-name
```

**Terraform deployment failed:**
```bash
# Check if you're in the right directory
pwd
# Should be: /path/to/your-project/infrastructure/environments/dev

# Check terraform.tfvars values
cat terraform.tfvars

# Re-run setup
./../../scripts/setup-dev.sh
```

**GitHub Actions workflow failed:**
```bash
# Check if repository variables are set:
# GitHub → Settings → Secrets and variables → Actions → Variables

# Required variables:
# - WIF_PROVIDER
# - WIF_SERVICE_ACCOUNT  
# - PROJECT_ID
# - REGION
# - ARTIFACT_REGISTRY_REPO

# These should be set automatically by setup scripts
```

### Common Error Messages

**"Project ID must be 6-30 characters":**
- Use only lowercase letters, numbers, and hyphens
- Start with a letter
- Example: `my-startup-dev-2024`

**"Appwrite Project ID must be 24 characters":**
- Copy the exact Project ID from Appwrite Console
- Should look like: `507f1f77bcf86cd799439011`

**"Docker compose command not found":**
```bash
# Install Docker Desktop from https://docker.com/desktop
# Make sure Docker is running (check system tray)
```

**"Permission denied" on scripts:**
```bash
# Make scripts executable
chmod +x infrastructure/scripts/*.sh
```

---

## 📖 Additional Documentation

- **`docs/ARCHITECTURE.md`** - Complete system architecture
- **`docs/CODING_CONVENTIONS.md`** - Code style and conventions
- **`docs/GITHUB_DEPLOYMENT_SETUP.md`** - Detailed deployment guide
- **`docs/PATH_ALIASES.md`** - Import path configuration

---

## 🎯 Enterprise Features

✅ **Full-Stack Support** - Web (Next.js) + Admin Dashboard  
✅ **Type Safety** - Strict TypeScript with no `any` types  
✅ **Code Quality** - ESLint, Prettier, automated checks  
✅ **Security** - Workload Identity Federation, Secret Manager  
✅ **Scalability** - Monorepo architecture, shared packages  
✅ **Monitoring** - Production alerts and logging  
✅ **Cost Optimization** - Environment-specific resource allocation  
✅ **Developer Experience** - Hot reload, automated setup  
✅ **Professional CI/CD** - Manual approvals, environment isolation  

**Built for teams. Ready for production. Enterprise-grade from day one.** 🚀

---

*Need help? Check the troubleshooting section above or open an issue on GitHub.*