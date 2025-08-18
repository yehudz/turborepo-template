# Project Configuration
variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "your-project-id"
}

variable "region" {
  description = "Google Cloud Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Database Configuration
variable "database_password" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

# Appwrite Authentication
variable "appwrite_project_id" {
  description = "Appwrite Project ID"
  type        = string
  sensitive   = true
}

variable "appwrite_url" {
  description = "Appwrite API endpoint URL"
  type        = string
  default     = "https://cloud.appwrite.io/v1"
}

# GitHub Configuration (for Workload Identity Federation)
variable "github_repository" {
  description = "GitHub repository in 'owner/repo' format for Workload Identity Federation"
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner (username or organization)"
  type        = string
}

# Application URLs
variable "app_url" {
  description = "Main application URL"
  type        = string
  default     = "https://your-app.com"
}

variable "api_url" {
  description = "API base URL"
  type        = string
  default     = "https://your-app.com/api"
}

# Cloud SQL Configuration
variable "database_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"  # Cheapest option
}

variable "database_disk_size" {
  description = "Database disk size in GB"
  type        = number
  default     = 10  # Minimum for SSD
}

# Cloud Run Configuration
variable "cloud_run_cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"  # Minimum
}

variable "cloud_run_memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "512Mi"  # Minimum
}

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0  # Scale to zero for cost savings
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}