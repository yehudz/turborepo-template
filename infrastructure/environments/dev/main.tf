# Development Environment Configuration
# This is where you enter your actual values

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
  environment = "dev"
}

# Call the Workload Identity Federation module
module "workload_identity" {
  source = "../../modules/workload-identity"
  
  # Basic Configuration  
  project_id        = var.project_id
  github_repository = "${var.github_owner}/${var.github_repository}"
  environment       = "dev"
  
  # Optional: Additional repositories that can deploy to dev
  additional_repositories = var.additional_repositories
}

# Local values for environment-specific configurations
locals {
  environment = "dev"
  
  # Dev-specific resource naming
  app_name = "${var.app_name}-dev"
  
  # Dev-specific scaling and resource limits
  cloud_run_config = {
    min_instances = 0
    max_instances = 10
    cpu          = "1"
    memory       = "512Mi"
  }
  
  # Dev database configuration
  database_config = {
    tier = "db-f1-micro"
    disk_size = 10
  }
}