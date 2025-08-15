output "workload_identity_provider" {
  description = "Full resource name of the Workload Identity Provider for use in GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "service_account_email" {
  description = "Email address of the service account created for GitHub Actions"
  value       = google_service_account.github_actions.email
}

output "service_account_id" {
  description = "The service account ID (not email)"
  value       = google_service_account.github_actions.account_id
}

output "workload_identity_pool_id" {
  description = "ID of the Workload Identity Pool"
  value       = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
}

output "project_number" {
  description = "The GCP project number (needed for some configurations)"
  value       = google_iam_workload_identity_pool.github_pool.name
}

output "github_repository_configured" {
  description = "The GitHub repository that has access to this Workload Identity"
  value       = var.github_repository
}

output "environment" {
  description = "The environment this Workload Identity was created for"
  value       = var.environment
}

output "github_variables" {
  description = "Public variables that need to be set in GitHub repository (not secrets)"
  value = {
    WIF_PROVIDER        = google_iam_workload_identity_pool_provider.github_provider.name
    WIF_SERVICE_ACCOUNT = google_service_account.github_actions.email
    PROJECT_ID          = var.project_id
    ENVIRONMENT         = var.environment
  }
  sensitive = false
}

output "setup_instructions" {
  description = "Instructions for setting up GitHub repository variables (GCP Secret Manager approach)"
  value = <<-EOT
    Set these VARIABLES (not secrets) in your GitHub repository (Settings → Secrets and variables → Actions → Variables tab):
    
    Repository Variables:
    - WIF_PROVIDER: ${google_iam_workload_identity_pool_provider.github_provider.name}
    - WIF_SERVICE_ACCOUNT: ${google_service_account.github_actions.email}
    - PROJECT_ID: ${var.project_id}
    - ENVIRONMENT: ${var.environment}
    
    Or use GitHub CLI:
    gh variable set WIF_PROVIDER --body "${google_iam_workload_identity_pool_provider.github_provider.name}"
    gh variable set WIF_SERVICE_ACCOUNT --body "${google_service_account.github_actions.email}"
    gh variable set PROJECT_ID --body "${var.project_id}"
    gh variable set ENVIRONMENT --body "${var.environment}"
    
    All application secrets will be fetched from GCP Secret Manager at runtime.
  EOT
}