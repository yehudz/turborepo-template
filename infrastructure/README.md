# Infrastructure Setup

This directory contains Terraform configuration for deploying the application infrastructure on Google Cloud Platform (GCP). The setup is optimized for cost-effectiveness while maintaining production-ready capabilities.

## Architecture Overview

- **Cloud Run**: Serverless container hosting with scale-to-zero
- **Cloud SQL (PostgreSQL)**: Managed database with private networking
- **Cloud Storage**: File storage with public access
- **Artifact Registry**: Container image storage
- **Secret Manager**: Secure environment variable storage
- **VPC Access Connector**: Private database connectivity

## Prerequisites

1. **Google Cloud Project**
   ```bash
   # Create a new project (optional)
   gcloud projects create your-project-id
   
   # Set the project
   gcloud config set project your-project-id
   ```

2. **Enable billing** on your GCP project

3. **Install required tools**:
   - [Terraform](https://www.terraform.io/downloads) >= 1.0
   - [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)

4. **Authenticate with GCP**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

## Setup Instructions

### 1. Configure Variables

Copy the example variables file and customize it:

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your actual values:

- `project_id`: Your GCP project ID
- `database_password`: Strong password for PostgreSQL
- `clerk_secret_key`: From [Clerk Dashboard](https://dashboard.clerk.com)
- `clerk_publishable_key`: From Clerk Dashboard
- `jwt_secret`: Random 32+ character string
- `app_url` and `api_url`: Your application URLs

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Infrastructure

```bash
terraform plan
```

Review the planned resources to ensure everything looks correct.

### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` when prompted to confirm the deployment.

## Cost Optimization Features

This configuration is optimized for minimal costs:

- **Cloud SQL**: `db-f1-micro` tier (cheapest option)
- **Cloud Run**: Scale-to-zero with minimal CPU/memory
- **Storage**: Lifecycle rules for automatic cleanup
- **Backup**: Reduced retention for development
- **Networking**: Uses default VPC to avoid additional costs

### Estimated Monthly Costs (US regions)

- Cloud SQL (db-f1-micro): ~$9/month
- Cloud Storage: ~$0.02/GB/month
- Cloud Run: Pay-per-use (free tier available)
- VPC Connector: ~$9/month (minimum charge)
- **Total**: ~$20-25/month for development workloads

## Important Outputs

After deployment, Terraform will output important values:

```bash
# View all outputs
terraform output

# Get specific values
terraform output database_connection_name
terraform output docker_repository_url
terraform output storage_bucket_name
```

## Security Features

- Database uses private networking (no public IP)
- Secrets stored in Google Secret Manager
- IAM roles follow principle of least privilege
- Storage bucket has CORS configured for web access

## Environment Management

To deploy multiple environments (dev, staging, prod):

1. Create separate `.tfvars` files:
   ```bash
   cp terraform.tfvars terraform-staging.tfvars
   cp terraform.tfvars terraform-prod.tfvars
   ```

2. Deploy with specific variable files:
   ```bash
   terraform apply -var-file="terraform-staging.tfvars"
   ```

3. Consider using [Terraform workspaces](https://www.terraform.io/docs/state/workspaces.html) for state isolation.

## Maintenance

### Updating Infrastructure

1. Modify the Terraform files as needed
2. Plan changes: `terraform plan`
3. Apply changes: `terraform apply`

### Backup and Recovery

- Database backups are automatically configured
- Point-in-time recovery is disabled for cost savings (enable in production)
- State files should be stored remotely (see `versions.tf`)

### Monitoring Costs

Monitor your GCP spending:

```bash
# View current costs
gcloud billing accounts list
gcloud billing budgets list --billing-account=BILLING_ACCOUNT_ID
```

## Cleanup

To destroy all resources and avoid charges:

```bash
terraform destroy
```

**Warning**: This will permanently delete all data!

## Troubleshooting

### Common Issues

1. **API not enabled**: Run `terraform apply` again after APIs are enabled
2. **Quota exceeded**: Request quota increases in GCP Console
3. **Permission denied**: Ensure you have proper IAM roles

### Getting Help

- [Terraform GCP Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Terraform Documentation](https://www.terraform.io/docs)

## Next Steps

After infrastructure deployment:

1. Configure your CI/CD pipeline (GitHub Actions)
2. Deploy your application to Cloud Run
3. Set up monitoring and alerting
4. Configure custom domains and SSL certificates