variable "project_id" {
  description = "The GCP project ID where resources will be created"
  type        = string
  
  validation {
    condition     = length(var.project_id) > 0
    error_message = "Project ID cannot be empty."
  }
}

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo' (e.g., 'username/my-app')"
  type        = string
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$", var.github_repository))
    error_message = "GitHub repository must be in format 'owner/repo'."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "service_account_id" {
  description = "Base ID for the service account (will be suffixed with environment)"
  type        = string
  default     = "github-actions"
  
  validation {
    condition     = can(regex("^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$", var.service_account_id))
    error_message = "Service account ID must be 6-30 characters, start with lowercase letter, and contain only lowercase letters, numbers, and hyphens."
  }
}

variable "additional_repositories" {
  description = "List of additional GitHub repositories that can use this Workload Identity (format: 'owner/repo')"
  type        = list(string)
  default     = []
  
  validation {
    condition = alltrue([
      for repo in var.additional_repositories : can(regex("^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$", repo))
    ])
    error_message = "All additional repositories must be in format 'owner/repo'."
  }
}

variable "custom_roles" {
  description = "Additional IAM roles to grant to the service account (beyond the default deployment roles)"
  type        = list(string)
  default     = []
  
  validation {
    condition = alltrue([
      for role in var.custom_roles : can(regex("^roles/", role))
    ])
    error_message = "All custom roles must start with 'roles/'."
  }
}