# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Data source for project info
data "google_project" "project" {
  project_id = var.project_id
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "run.googleapis.com",
    "vpcaccess.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com"
  ])
  
  project = var.project_id
  service = each.value
  
  disable_on_destroy = false
}

# Generate random bucket suffix
resource "random_id" "bucket_suffix" {
  byte_length = 8
}

# Cloud Storage Bucket for file uploads
resource "google_storage_bucket" "app_bucket" {
  name     = "${var.project_id}-storage-${random_id.bucket_suffix.hex}"
  location = "US"
  project  = var.project_id
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
  
  depends_on = [google_project_service.apis]
}

# Make bucket objects publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.app_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Artifact Registry Repository
resource "google_artifact_registry_repository" "repo" {
  repository_id = "${var.project_id}-${var.environment}"
  format        = "DOCKER"
  location      = var.region
  project       = var.project_id
  
  cleanup_policies {
    id     = "keep-recent-2"
    action = "KEEP"
    
    most_recent_versions {
      keep_count = 2
    }
  }
  
  depends_on = [google_project_service.apis]
}

# VPC Network (using default for cost savings)
data "google_compute_network" "default" {
  name    = "default"
  project = var.project_id
}

# Reserved IP range for private services
resource "google_compute_global_address" "private_ip_range" {
  name          = "private-ip-range-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = data.google_compute_network.default.id
  project       = var.project_id
  
  depends_on = [google_project_service.apis]
}

# Private connection for Cloud SQL
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = data.google_compute_network.default.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
  
  depends_on = [google_project_service.apis]
}

# Cloud SQL Database Instance (cheapest configuration)
resource "google_sql_database_instance" "postgres" {
  name                = "${var.project_id}-pg-${var.environment}"
  database_version    = "POSTGRES_15"  # Stable version
  region              = var.region
  project             = var.project_id
  deletion_protection = false
  
  settings {
    tier              = var.database_tier      # db-f1-micro (cheapest)
    availability_type = "ZONAL"               # Single zone (cheaper than regional)
    disk_type         = "PD_SSD"
    disk_size         = var.database_disk_size
    disk_autoresize   = true
    
    ip_configuration {
      ipv4_enabled                                  = true
      private_network                               = data.google_compute_network.default.id
      enable_private_path_for_google_cloud_services = true
    }
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = false  # Disabled for cost savings
      backup_retention_settings {
        retained_backups = 3  # Minimum retention
      }
    }
    
    insights_config {
      query_insights_enabled = false  # Disabled for cost savings
    }
  }
  
  depends_on = [
    google_project_service.apis,
    google_service_networking_connection.private_vpc_connection
  ]
}

# Database
resource "google_sql_database" "database" {
  name     = "app_db"
  instance = google_sql_database_instance.postgres.name
  project  = var.project_id
}

# Database User
resource "google_sql_user" "user" {
  name     = "app_user"
  instance = google_sql_database_instance.postgres.name
  password = var.database_password
  project  = var.project_id
}

# VPC Connector Subnet
resource "google_compute_subnetwork" "vpc_connector" {
  name          = "vpc-connector-subnet-${var.environment}"
  region        = var.region
  network       = data.google_compute_network.default.name
  ip_cidr_range = "10.8.0.0/28"
  project       = var.project_id
  
  depends_on = [google_project_service.apis]
}

# VPC Access Connector (cheapest configuration)
resource "google_vpc_access_connector" "connector" {
  name          = "connector-${var.environment}"
  region        = var.region
  project       = var.project_id
  min_instances = 2  # Minimum
  max_instances = 3  # Keep low for cost
  
  subnet {
    name       = google_compute_subnetwork.vpc_connector.name
    project_id = var.project_id
  }
  
  depends_on = [google_project_service.apis]
}

# Secret Manager Secrets
locals {
  database_url = "postgresql://${google_sql_user.user.name}:${var.database_password}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.database.name}?sslmode=require"
  
  secrets = {
    "DATABASE_URL" = local.database_url
    "CLERK_SECRET_KEY" = var.clerk_secret_key
    "CLERK_WEBHOOK_SECRET" = var.clerk_webhook_secret
    "JWT_SECRET" = var.jwt_secret
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" = var.clerk_publishable_key
    "NEXT_PUBLIC_APP_URL" = var.app_url
    "NEXT_PUBLIC_API_URL" = var.api_url
    "GOOGLE_CLOUD_BUCKET_NAME" = google_storage_bucket.app_bucket.name
  }
}

# Create secrets
resource "google_secret_manager_secret" "secrets" {
  for_each = local.secrets
  
  secret_id = each.key
  project   = var.project_id
  
  replication {
    auto {}
  }
  
  depends_on = [google_project_service.apis]
}

# Create secret versions
resource "google_secret_manager_secret_version" "secret_versions" {
  for_each = local.secrets
  
  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value
}

# IAM roles for Cloud Run service account
resource "google_project_iam_member" "compute_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "compute_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "compute_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}