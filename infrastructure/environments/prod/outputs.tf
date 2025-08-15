# Production Environment Outputs
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
  value       = "prod"
}

output "project_id" {
  description = "GCP project ID used"
  value       = var.project_id
}

output "region" {
  description = "GCP region used"
  value       = var.region
}

# Production-specific outputs
output "production_urls" {
  description = "Production application URLs"
  value = {
    web_app   = "https://${var.app_name}-web-${substr(module.infrastructure.cloud_run_service_urls["web"], -8, 8)}.a.run.app"
    admin_app = "https://${var.app_name}-admin-${substr(module.infrastructure.cloud_run_service_urls["admin"], -8, 8)}.a.run.app"
    api       = "https://${var.app_name}-api-${substr(module.infrastructure.cloud_run_service_urls["api"], -8, 8)}.a.run.app"
  }
  depends_on = [module.infrastructure]
}

output "monitoring_info" {
  description = "Production monitoring and alerting information"
  value = {
    alert_email_configured = var.alert_email != ""
    backup_enabled        = var.enable_backup
    backup_retention_days = var.backup_retention_days
  }
}

# Quick deployment info
output "deployment_summary" {
  description = "Summary of deployed production resources"
  value = {
    environment           = "prod"
    project_id           = var.project_id
    region               = var.region
    github_repository    = "${var.github_owner}/${var.github_repository}"
    service_account      = module.workload_identity.service_account_email
    workload_identity    = module.workload_identity.workload_identity_provider
    backup_enabled       = var.enable_backup
    alert_email         = var.alert_email != "" ? "configured" : "not_configured"
  }
}

# Security reminder
output "security_checklist" {
  description = "Production security checklist"
  value = <<-EOT
    Production Security Checklist:
    ✓ Workload Identity Federation (keyless auth)
    ✓ Separate production project/environment
    ✓ All secrets in GCP Secret Manager
    ${var.alert_email != "" ? "✓" : "⚠"} Monitoring alerts configured
    ${var.enable_backup ? "✓" : "⚠"} Automated backups enabled
    
    ${var.alert_email == "" ? "⚠ RECOMMENDATION: Set alert_email for production monitoring" : ""}
    ${!var.enable_backup ? "⚠ RECOMMENDATION: Enable backups for production" : ""}
  EOT
}