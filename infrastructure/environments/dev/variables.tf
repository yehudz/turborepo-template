# Development Environment Variables
# These define what inputs this environment accepts

variable "project_id" {
  description = "The GCP project ID for the development environment"
  type        = string
  
  validation {
    condition     = length(var.project_id) > 0
    error_message = "Project ID cannot be empty."
  }
}

variable "region" {
  description = "GCP region for development resources"
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
  description = "Application name (used for resource naming)"
  type        = string
  default     = "turborepo-app"
  
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]*[a-z0-9]$", var.app_name))
    error_message = "App name must start with a letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number."
  }
}

variable "appwrite_project_id" {
  description = "Appwrite project ID"
  type        = string
  
  validation {
    condition     = length(var.appwrite_project_id) > 0
    error_message = "Appwrite project ID cannot be empty."
  }
}

variable "appwrite_url" {
  description = "Appwrite server URL"
  type        = string
  default     = "https://cloud.appwrite.io/v1"
  
  validation {
    condition     = can(regex("^https?://", var.appwrite_url))
    error_message = "Appwrite URL must be a valid HTTP or HTTPS URL."
  }
}

variable "additional_repositories" {
  description = "Additional GitHub repositories that can deploy to this environment (format: 'owner/repo')"
  type        = list(string)
  default     = []
  
  validation {
    condition = alltrue([
      for repo in var.additional_repositories : can(regex("^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$", repo))
    ])
    error_message = "All additional repositories must be in format 'owner/repo'."
  }
}