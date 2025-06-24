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

# Clerk Authentication
variable "clerk_secret_key" {
  description = "Clerk Secret Key"
  type        = string
  sensitive   = true
}

variable "clerk_publishable_key" {
  description = "Clerk Publishable Key"
  type        = string
  sensitive   = true
}

variable "clerk_webhook_secret" {
  description = "Clerk Webhook Secret"
  type        = string
  sensitive   = true
  default     = ""
}

# JWT Configuration
variable "jwt_secret" {
  description = "JWT secret for token signing"
  type        = string
  sensitive   = true
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