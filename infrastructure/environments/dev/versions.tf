terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.84.0"
    }
  }
  
  # Backend configuration for state storage
  # Uncomment and configure after creating a GCS bucket for state
  # backend "gcs" {
  #   bucket = "your-project-terraform-state-dev"
  #   prefix = "terraform/state"
  # }
}