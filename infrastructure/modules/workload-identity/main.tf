# Workload Identity Federation for GitHub Actions
# This module creates WIF resources for keyless authentication

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "iamcredentials.googleapis.com",
    "iam.googleapis.com"
  ])
  
  project = var.project_id
  service = each.value
  
  disable_dependent_services = false
  disable_on_destroy         = false
}

# Create Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  project                   = var.project_id
  workload_identity_pool_id = "${var.environment}-github-actions"
  display_name              = "${title(var.environment)} GitHub Actions Pool"
  description               = "Workload Identity Pool for GitHub Actions in ${var.environment} environment"
  
  depends_on = [google_project_service.required_apis]
}

# Create GitHub OIDC Provider
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
  display_name                       = "GitHub Provider"
  description                        = "GitHub OIDC Provider for ${var.environment} environment"
  
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.actor"      = "assertion.actor"
    "attribute.ref"        = "assertion.ref"
  }
  
  attribute_condition = "assertion.repository == '${var.github_repository}'"
  
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Create Service Account for GitHub Actions
resource "google_service_account" "github_actions" {
  project      = var.project_id
  account_id   = "${var.service_account_id}-${var.environment}"
  display_name = "${title(var.environment)} GitHub Actions Service Account"
  description  = "Service Account for GitHub Actions deployments in ${var.environment} environment"
}

# Allow GitHub Actions to impersonate the service account
resource "google_service_account_iam_binding" "github_actions_workload_identity" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  
  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
  ]
}

# Grant necessary IAM roles to the service account
resource "google_project_iam_member" "github_actions_roles" {
  for_each = toset([
    "roles/run.admin",                    # Deploy to Cloud Run
    "roles/artifactregistry.writer",     # Push Docker images
    "roles/secretmanager.secretAccessor", # Access Secret Manager
    "roles/storage.admin",                # Manage Cloud Storage
    "roles/iam.serviceAccountUser"        # Use service accounts
  ])
  
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Additional repository access (if specified)
resource "google_service_account_iam_binding" "additional_repositories" {
  count = length(var.additional_repositories) > 0 ? 1 : 0
  
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  
  members = [
    for repo in var.additional_repositories :
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${repo}"
  ]
}