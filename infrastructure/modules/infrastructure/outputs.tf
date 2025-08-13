# Project Information
output "project_id" {
  description = "Google Cloud Project ID"
  value       = var.project_id
}

output "region" {
  description = "Google Cloud Region"
  value       = var.region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

# Database Outputs
output "database_instance_name" {
  description = "Cloud SQL instance name"
  value       = google_sql_database_instance.postgres.name
}

output "database_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.postgres.connection_name
}

output "database_private_ip" {
  description = "Cloud SQL private IP address"
  value       = google_sql_database_instance.postgres.private_ip_address
  sensitive   = true
}

output "database_name" {
  description = "Database name"
  value       = google_sql_database.database.name
}

# Storage Outputs
output "storage_bucket_name" {
  description = "Cloud Storage bucket name"
  value       = google_storage_bucket.app_bucket.name
}

output "storage_bucket_url" {
  description = "Cloud Storage bucket URL"
  value       = google_storage_bucket.app_bucket.url
}

# Container Registry
output "artifact_registry_repository" {
  description = "Artifact Registry repository URL"
  value       = google_artifact_registry_repository.repo.name
}

output "docker_repository_url" {
  description = "Docker repository URL for pushing images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}"
}

# VPC Outputs
output "vpc_connector_name" {
  description = "VPC Access Connector name"
  value       = google_vpc_access_connector.connector.name
}

output "vpc_connector_id" {
  description = "VPC Access Connector ID for Cloud Run"
  value       = google_vpc_access_connector.connector.id
}

# Secret Manager
output "secret_names" {
  description = "List of Secret Manager secret names"
  value       = keys(google_secret_manager_secret.secrets)
}

# URLs for easy access
output "app_url" {
  description = "Application URL"
  value       = var.app_url
}

output "api_url" {
  description = "API URL"
  value       = var.api_url
}

# Service Account Email
output "compute_service_account" {
  description = "Compute Engine default service account email"
  value       = "${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}