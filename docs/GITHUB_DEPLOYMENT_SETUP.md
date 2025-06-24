# GitHub Deployment Setup Guide

This guide shows you how to configure GitHub repository secrets and variables for automatic deployment to Google Cloud Platform.

## 🔧 Required GitHub Repository Configuration

### **1. Repository Variables**

Go to **Settings → Secrets and variables → Actions → Variables tab** and add:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `PROJECT_ID` | `my-project-123` | Your GCP Project ID |
| `REGION` | `us-central1` | GCP region for deployment |
| `ARTIFACT_REGISTRY_REPO` | `my-app-repo` | Artifact Registry repository name |
| `VPC_CONNECTOR` | `my-vpc-connector` | VPC connector for Cloud Run (optional) |

### **2. Repository Secrets**

Go to **Settings → Secrets and variables → Actions → Secrets tab** and add:

#### **Workload Identity Secrets**
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `WIF_PROVIDER` | Workload Identity Provider | `projects/PROJECT-NUMBER/locations/global/workloadIdentityPools/POOL-ID/providers/PROVIDER-ID` |
| `WIF_SERVICE_ACCOUNT` | Service Account Email | `github-actions@PROJECT-ID.iam.gserviceaccount.com` |

#### **Application Secrets (from Secret Manager)**
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DATABASE_URL` | Production database URL | `postgresql://user:pass@host/db` |
| `CLERK_SECRET_KEY` | Clerk production secret | `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | `whsec_...` |
| `JWT_SECRET` | JWT signing secret | `your-production-jwt-secret` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_live_...` |
| `NEXT_PUBLIC_APP_URL` | Production app URL | `https://yourapp.run.app` |
| `NEXT_PUBLIC_API_URL` | Production API URL | `https://yourapp.run.app/api` |
| `GOOGLE_CLOUD_BUCKET_NAME` | GCS bucket name | `my-app-uploads` |

## 🏗️ GCP Infrastructure Setup

### **1. Prerequisites**

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Set your project
gcloud config set project YOUR-PROJECT-ID
```

### **2. Enable Required APIs**

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iamcredentials.googleapis.com
```

### **3. Create Artifact Registry Repository**

```bash
gcloud artifacts repositories create my-app-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for my app"
```

### **4. Set Up Workload Identity Federation**

```bash
# Create workload identity pool
gcloud iam workload-identity-pools create github-actions \
  --location="global" \
  --description="Pool for GitHub Actions"

# Create workload identity provider
gcloud iam workload-identity-pools providers create-oidc github \
  --workload-identity-pool="github-actions" \
  --location="global" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
  --attribute-condition="assertion.repository=='YOUR-GITHUB-USERNAME/YOUR-REPO-NAME'"
```

### **5. Create Service Account**

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --description="Service account for GitHub Actions" \
  --display-name="GitHub Actions"

# Get project number
PROJECT_NUMBER=$(gcloud projects describe YOUR-PROJECT-ID --format="value(projectNumber)")

# Allow service account to be used by GitHub Actions
gcloud iam service-accounts add-iam-policy-binding \
  "github-actions@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/attribute.repository/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:github-actions@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:github-actions@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR-PROJECT-ID \
  --member="serviceAccount:github-actions@YOUR-PROJECT-ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### **6. Store Secrets in Secret Manager**

```bash
# Store application secrets
echo -n "postgresql://user:pass@host/db" | gcloud secrets create DATABASE_URL --data-file=-
echo -n "sk_live_your_clerk_secret" | gcloud secrets create CLERK_SECRET_KEY --data-file=-
echo -n "whsec_your_webhook_secret" | gcloud secrets create CLERK_WEBHOOK_SECRET --data-file=-
echo -n "your-production-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-
echo -n "pk_live_your_clerk_key" | gcloud secrets create NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY --data-file=-
echo -n "https://yourapp.run.app" | gcloud secrets create NEXT_PUBLIC_APP_URL --data-file=-
echo -n "https://yourapp.run.app/api" | gcloud secrets create NEXT_PUBLIC_API_URL --data-file=-
echo -n "my-app-uploads" | gcloud secrets create GOOGLE_CLOUD_BUCKET_NAME --data-file=-
```

## 📝 GitHub Repository Setup Checklist

### **Repository Variables** (Settings → Actions → Variables)
- [ ] `PROJECT_ID` = `your-gcp-project-id`
- [ ] `REGION` = `us-central1` (or your preferred region)
- [ ] `ARTIFACT_REGISTRY_REPO` = `your-app-repo`
- [ ] `VPC_CONNECTOR` = `your-vpc-connector` (optional)

### **Repository Secrets** (Settings → Actions → Secrets)
- [ ] `WIF_PROVIDER` = `projects/PROJECT-NUMBER/locations/global/workloadIdentityPools/github-actions/providers/github`
- [ ] `WIF_SERVICE_ACCOUNT` = `github-actions@YOUR-PROJECT-ID.iam.gserviceaccount.com`

### **Verify Deployment Setup**

1. **Push to main branch** to trigger deployment
2. **Check Actions tab** in GitHub to see deployment progress
3. **Visit Cloud Run console** to see your deployed service
4. **Test the deployed URL** to verify everything works

## 🚨 Important Notes

### **Replace Placeholders:**
- `YOUR-PROJECT-ID` → Your actual GCP project ID
- `YOUR-GITHUB-USERNAME` → Your GitHub username
- `YOUR-REPO-NAME` → Your repository name
- Update all secret values with your actual production values

### **Security Best Practices:**
- Use **Workload Identity Federation** (no service account keys)
- Store **all secrets in GCP Secret Manager**
- Use **least privilege** IAM permissions
- Enable **audit logging** for sensitive operations

### **Cost Optimization:**
- Cloud Run **scales to zero** when not in use
- Use **min-instances: 0** for development
- Monitor **costs in GCP Console**

## 🔍 Troubleshooting

### **Common Issues:**

1. **Authentication Failed:**
   - Verify Workload Identity Federation setup
   - Check service account permissions
   - Ensure repository name matches exactly

2. **Build Failed:**
   - Check that all required secrets are set
   - Verify Artifact Registry repository exists
   - Check Docker build logs in Actions

3. **Deployment Failed:**
   - Verify Cloud Run API is enabled
   - Check service account has `roles/run.admin`
   - Ensure region is correct

### **Debugging Commands:**

```bash
# Check workload identity pool
gcloud iam workload-identity-pools describe github-actions --location=global

# List secrets
gcloud secrets list

# Check service account permissions
gcloud projects get-iam-policy YOUR-PROJECT-ID --flatten="bindings[].members" --filter="bindings.members:github-actions@*"
```

## 🎉 Success!

Once configured, every push to `main` will automatically:
1. **Build** your application
2. **Create** a Docker image
3. **Deploy** to Cloud Run
4. **Output** the service URL

Your app will be live at: `https://web-app-HASH-REGION.a.run.app` 🚀