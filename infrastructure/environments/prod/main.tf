# Production Environment Configuration
# This is where you enter your actual production values

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Call the infrastructure module (existing GCP resources)
module "infrastructure" {
  source = "../../modules/infrastructure"
  
  # Basic Configuration
  project_id = var.project_id
  region     = var.region
  
  # GitHub Repository for deployments
  github_repository = var.github_repository
  github_owner      = var.github_owner
  
  # Appwrite Configuration
  appwrite_project_id = var.appwrite_project_id
  appwrite_url       = var.appwrite_url
  
  # Environment-specific settings
  environment = "prod"
}

# Call the Workload Identity Federation module
module "workload_identity" {
  source = "../../modules/workload-identity"
  
  # Basic Configuration  
  project_id        = var.project_id
  github_repository = "${var.github_owner}/${var.github_repository}"
  environment       = "prod"
  
  # Optional: Additional repositories that can deploy to prod
  additional_repositories = var.additional_repositories
}

# Local values for production-specific configurations
locals {
  environment = "prod"
  
  # Production-specific resource naming
  app_name = var.app_name  # No suffix for production
  
  # Production-specific scaling and resource limits
  cloud_run_config = {
    min_instances = 1    # Always keep 1 instance warm
    max_instances = 100  # Higher scaling for production traffic
    cpu          = "2"   # More CPU for production
    memory       = "2Gi" # More memory for production
  }
  
  # Production database configuration
  database_config = {
    tier = "db-custom-2-4096"  # Higher performance tier
    disk_size = 100            # More storage
    backup_retention = 30      # Longer backup retention
  }
  
  # Production monitoring and alerting
  monitoring_config = {
    enable_alerts = true
    alert_email  = var.alert_email
  }
}