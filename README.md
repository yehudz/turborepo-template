# 🚀 Enterprise Turborepo Template

**The complete full-stack template for modern web applications.** From local development to production deployment in 15 minutes.

✅ **Next.js 15** + **React 19** + **TypeScript**  
✅ **React Native mobile app** with **Expo SDK 52**  
✅ **Shadcn/ui** design system + **Tailwind CSS v4**  
✅ **Appwrite authentication** + **PostgreSQL database**  
✅ **Google Cloud deployment** with **manual CI/CD approval**  
✅ **Mobile CI/CD** with **EAS Build** and **TestFlight/Google Play**  
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

9. **Open your applications:**
   - **Web app:** http://localhost:3001
   - **Admin app:** http://localhost:3000

**🎉 Local development is now running!**

---

## Part 3: Mobile App Development (Optional)

**If you opted for the mobile app during setup, follow these steps:**

### Prerequisites for Mobile Development

1. **Install Expo CLI:**
   ```bash
   npm install -g @expo/cli
   npm install -g eas-cli
   ```

2. **Install mobile development tools:**
   - **iOS Development:** Xcode (macOS only) or iOS Simulator
   - **Android Development:** Android Studio or Android device
   - **Testing on device:** Expo Go app from App Store/Google Play

### Local Mobile Development

1. **Start mobile development server:**
   ```bash
   # From project root
   pnpm dev
   # Select "Mobile only" or "All apps" when prompted
   ```

2. **Test on your device:**
   - Install **Expo Go** app on your phone
   - Scan the QR code displayed in terminal
   - Your mobile app will load on your device

3. **Test on simulators:**
   ```bash
   # iOS Simulator (macOS only)
   press 'i' in the terminal
   
   # Android Emulator
   press 'a' in the terminal
   ```

### Mobile App Structure

- **`apps/mobile/`** - React Native app with Expo
- **`apps/mobile/app/index.tsx`** - Main mobile screen
- **`apps/mobile/app/_layout.tsx`** - Navigation layout
- Uses **React Native StyleSheet** for platform-optimized styling

### Mobile Development Workflow

1. **Make changes** to files in `apps/mobile/`
2. **Fast Refresh** automatically updates your app
3. **Test on device** using Expo Go
4. **Commit changes** and push to GitHub

**📱 Your mobile app is now ready for development!**

---

## Part 4: Mobile CI/CD Setup (EAS Build)

**Set up professional mobile deployment pipeline:**

### One-Time EAS Setup

1. **Create Expo account:**
   ```bash
   # Open Expo dashboard:
   open https://expo.dev
   ```
   - Sign up for free account
   - Verify your email

2. **Login to EAS:**
   ```bash
   cd apps/mobile
   eas login
   ```

3. **Configure EAS builds:**
   ```bash
   eas build:configure
   ```
   - This creates `eas.json` with QA and Production profiles

### GitHub Secrets Setup

1. **Get your Expo token:**
   ```bash
   eas whoami
   # Note your username, then:
   open https://expo.dev/accounts/[YOUR-USERNAME]/settings/access-tokens
   ```
   - Click **"Create Token"**
   - Name: `GitHub Actions`
   - Copy the token

2. **Set up your mobile project (2 minutes):**
   
   **First, choose your app name:**
   ```bash
   cd apps/mobile
   # Open app.json and change these two lines:
   # "name": "Your App Name" (what users see)
   # "slug": "your-app-slug" (lowercase, dashes only, no spaces)
   ```
   
   **Then create the EAS project:**
   ```bash
   eas init
   ```
   - It will use the slug from your app.json
   - Press **Enter** to confirm
   - When it's done, run:
   ```bash
   eas project:info
   ```
   - **Copy the ID** shown (it's a long string with dashes)

3. **Add to GitHub (1 minute):**
   - Go to your GitHub repository
   - Click **Settings** (top menu)
   - Click **Secrets and variables** → **Actions** (left sidebar)
   - Add two secrets:
   
   **Secret #1:**
   - Click **"New repository secret"**
   - Name: `EXPO_TOKEN`
   - Value: Paste the token from step 1
   - Click **"Add secret"**
   
   **Secret #2:**
   - Click **"New repository secret"** again
   - Name: `EXPO_PROJECT_ID`
   - Value: Paste the ID from step 2
   - Click **"Add secret"**

4. **Generate Android credentials (1 minute):**
   
   **Important:** This step is required for CI/CD to work with Android builds.
   
   ```bash
   cd apps/mobile
   eas credentials
   ```
   - Select **Android**
   - Select **qa** (build profile)
   - Choose **"Keystore: Manage everything needed to build your project"**
   - Choose **"Set up a new keystore"**
   - Press **Enter** to accept the default name
   - Choose **"yes"** to generate keystore in the cloud
   - Press **any key** to continue
   - Choose **"Go back"** to exit
   
   **✅ Android credentials created! CI/CD will now work.**

### Mobile CI/CD Requirements

**One-time setup for production mobile deployment:**

5. **Configure App Store credentials (Production only):**
   - **iOS:** Apple Developer account credentials for App Store submission
   - **Android:** Google Play Console credentials for Play Store submission
   - These are configured separately in your Expo dashboard when ready for production

**✅ Your mobile CI/CD pipeline is now configured and ready!**

### Mobile Deployment Environments

#### **QA Environment (Internal Testing)**
- **Trigger:** Push to `develop` branch
- **Build profile:** `qa`
- **Distribution:** Internal testing (TestFlight/Firebase App Distribution)
- **Automatic:** Builds and distributes to testers

#### **Production Environment (App Stores)**
- **Trigger:** Manual approval workflow
- **Build profile:** `production`
- **Distribution:** App Store and Google Play Store
- **Manual:** Requires approval for store submission

### Mobile Testing Workflow

1. **For QA Testing:**
   ```bash
   # Push to develop branch
   git checkout develop
   git merge feature/your-feature
   git push origin develop
   ```
   - EAS automatically builds and distributes to testers
   - Testers get notified via TestFlight (iOS) or email (Android)

2. **Add Testers:**
   ```bash
   # iOS testers (TestFlight)
   eas device:create --platform ios
   
   # Android testers get download links automatically
   ```

3. **For Production Release:**
   - Go to GitHub → **Actions**
   - Run **"Mobile Production Build"** workflow
   - Manual approval required
   - Automatically submits to App Store/Google Play

### Mobile App Store Requirements

#### **iOS App Store (Required for TestFlight)**
- **Apple Developer Account:** $99/year
- **Bundle ID:** Configure in `app.json`
- **App Store Connect:** Set up app listing

#### **Google Play Store (Required for Play Console)**
- **Google Play Developer Account:** $25 one-time fee
- **App Bundle:** Automatically generated by EAS
- **Play Console:** Set up app listing

### Mobile Development Commands

```bash
# Development
cd apps/mobile
eas build --profile qa              # Build QA version
eas build --profile production      # Build production version
eas submit --platform ios          # Submit to App Store
eas submit --platform android      # Submit to Google Play

# Testing
expo start                          # Start development server
expo start --clear                  # Clear cache and start
```

**📱 Your mobile CI/CD pipeline is now ready!**

---

## Part 5: Infrastructure Deployment (Optional)

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

## Part 4: Production Infrastructure Setup

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

## Part 5: Deploy Your Application

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

## Part 6: Complete Workflow Summary

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
pnpm dev                 # Start all apps in development (interactive menu)
pnpm build              # Build all apps for production
pnpm lint               # Lint all packages
pnpm typecheck          # Type check all packages
pnpm validate-env       # Validate environment setup
```

### Mobile Development Commands
```bash
cd apps/mobile
expo start              # Start mobile development server
expo start --clear      # Clear cache and start
eas build --profile qa  # Build QA version for testing
eas login               # Login to Expo account
eas build:configure     # Configure EAS builds
```

### Optional: Firebase Test Lab Integration
For automated testing across 50+ real devices, you can integrate Firebase Test Lab into your CI/CD pipeline. This provides automated crash detection, performance testing, and compatibility testing before reaching human testers. See Firebase Test Lab documentation for setup details.

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
- **`apps/mobile`** - React Native mobile app with Expo SDK 52

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

✅ **Full-Stack Support** - Web (Next.js) + Mobile (React Native/Expo)  
✅ **Type Safety** - Strict TypeScript with no `any` types  
✅ **Code Quality** - ESLint, Prettier, automated checks  
✅ **Security** - Workload Identity Federation, Secret Manager  
✅ **Scalability** - Monorepo architecture, shared packages  
✅ **Mobile CI/CD** - EAS Build, TestFlight, Google Play deployment  
✅ **Monitoring** - Production alerts and logging  
✅ **Cost Optimization** - Environment-specific resource allocation  
✅ **Developer Experience** - Hot reload, automated setup  
✅ **Professional CI/CD** - Manual approvals, environment isolation  

**Built for teams. Ready for production. Enterprise-grade from day one.** 🚀

---

*Need help? Check the troubleshooting section above or open an issue on GitHub.*
