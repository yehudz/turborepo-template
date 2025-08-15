# Development Environment Outputs
# These expose important values after deployment

# Infrastructure outputs
output "infrastructure_outputs" {
  description = "All outputs from the infrastructure module"
  value       = module.infrastructure
  sensitive   = true
}

# Workload Identity outputs
output "workload_identity_provider" {
  description = "Workload Identity Provider for GitHub Actions"
  value       = module.workload_identity.workload_identity_provider
}

output "service_account_email" {
  description = "Service account email for GitHub Actions"
  value       = module.workload_identity.service_account_email
}

output "github_variables_needed" {
  description = "GitHub repository variables that need to be set"
  value       = module.workload_identity.github_variables
}

output "setup_instructions" {
  description = "Instructions for configuring GitHub repository"
  value       = module.workload_identity.setup_instructions
}

# Environment info
output "environment" {
  description = "Environment name"
  value       = "dev"
}

output "project_id" {
  description = "GCP project ID used"
  value       = var.project_id
}

output "region" {
  description = "GCP region used"
  value       = var.region
}

# Quick deployment info
output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    environment           = "dev"
    project_id           = var.project_id
    region               = var.region
    github_repository    = "${var.github_owner}/${var.github_repository}"
    service_account      = module.workload_identity.service_account_email
    workload_identity    = module.workload_identity.workload_identity_provider
  }
}