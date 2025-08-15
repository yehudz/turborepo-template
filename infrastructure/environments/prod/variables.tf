# Production Environment Variables
# These define what inputs this environment accepts

variable "project_id" {
  description = "The GCP project ID for the production environment"
  type        = string
  
  validation {
    condition     = length(var.project_id) > 0
    error_message = "Project ID cannot be empty."
  }
}

variable "region" {
  description = "GCP region for production resources"
  type        = string
  default     = "us-central1"
}

variable "github_owner" {
  description = "GitHub username or organization (e.g., 'john-doe' or 'my-company')"
  type        = string
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]+$", var.github_owner))
    error_message = "GitHub owner must contain only letters, numbers, underscores, dots, and hyphens."
  }
}

variable "github_repository" {
  description = "GitHub repository name (without owner, e.g., 'my-app')"
  type        = string
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]+$", var.github_repository))
    error_message = "GitHub repository name must contain only letters, numbers, underscores, dots, and hyphens."
  }
}

variable "app_name" {
  description = "Application name (used for resource naming in production)"
  type        = string
  default     = "turborepo-app"
  
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]*[a-z0-9]$", var.app_name))
    error_message = "App name must start with a letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number."
  }
}

variable "appwrite_project_id" {
  description = "Appwrite project ID for production"
  type        = string
  
  validation {
    condition     = length(var.appwrite_project_id) > 0
    error_message = "Appwrite project ID cannot be empty."
  }
}

variable "appwrite_url" {
  description = "Appwrite server URL for production"
  type        = string
  default     = "https://cloud.appwrite.io/v1"
  
  validation {
    condition     = can(regex("^https?://", var.appwrite_url))
    error_message = "Appwrite URL must be a valid HTTP or HTTPS URL."
  }
}

variable "additional_repositories" {
  description = "Additional GitHub repositories that can deploy to production (format: 'owner/repo')"
  type        = list(string)
  default     = []
  
  validation {
    condition = alltrue([
      for repo in var.additional_repositories : can(regex("^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$", repo))
    ])
    error_message = "All additional repositories must be in format 'owner/repo'."
  }
}

variable "alert_email" {
  description = "Email address for production alerts and monitoring notifications"
  type        = string
  default     = ""
  
  validation {
    condition     = var.alert_email == "" || can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.alert_email))
    error_message = "Alert email must be a valid email address or empty string."
  }
}

variable "enable_backup" {
  description = "Enable automated backups for production resources"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain backups in production"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_retention_days >= 7 && var.backup_retention_days <= 365
    error_message = "Backup retention must be between 7 and 365 days."
  }
}