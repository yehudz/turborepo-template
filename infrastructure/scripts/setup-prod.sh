#!/bin/bash

# Production Environment Setup Script
# This script automates the complete setup of a production environment with enhanced security

set -e  # Exit on any error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INFRASTRUCTURE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source common functions
source "$SCRIPT_DIR/common.sh"

# Global variables
ENVIRONMENT="prod"
ENV_DIR="$INFRASTRUCTURE_DIR/environments/$ENVIRONMENT"

main() {
    log_header "Turborepo Production Environment Setup"
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Production-specific warnings and confirmations
    production_warnings
    
    # Step 1: Prerequisites
    check_prerequisites
    check_gcloud_auth
    check_github_auth
    
    # Step 2: Repository Detection
    detect_github_repo
    
    # Step 3: Production Safety Checks
    production_safety_checks
    
    # Step 4: Collect Configuration
    collect_production_configuration
    
    # Step 5: GCP Project Setup
    setup_gcp_project "$PROJECT_ID" "$ENVIRONMENT"
    enable_gcp_apis "$PROJECT_ID"
    
    # Step 6: Terraform Backend
    local bucket_name=$(create_terraform_state_bucket "$PROJECT_ID" "$ENVIRONMENT")
    configure_terraform_backend "$bucket_name" "$ENV_DIR/backend.tf"
    
    # Step 7: Generate Configuration
    generate_terraform_vars "$ENV_DIR" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO" "$APPWRITE_PROJECT_ID" "$ALERT_EMAIL"
    
    # Step 8: Production Review
    production_configuration_review
    
    # Step 9: Deploy Infrastructure
    run_terraform "$ENV_DIR" "$ENVIRONMENT"
    
    # Step 10: Configure GitHub
    configure_github_variables "$GITHUB_OWNER" "$GITHUB_REPO" "$ENV_DIR"
    
    # Step 11: Production Validation
    production_validation
    
    # Step 12: Security Checklist and Summary
    show_production_summary "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO"
}

production_warnings() {
    echo ""
    log_warning "🚨 PRODUCTION ENVIRONMENT SETUP 🚨"
    echo ""
    echo -e "${RED}IMPORTANT PRODUCTION CONSIDERATIONS:${NC}"
    echo "  • This will create PRODUCTION resources that incur costs"
    echo "  • Production should use a SEPARATE GCP project from development"
    echo "  • Production should use a SEPARATE Appwrite project"
    echo "  • All production data will be stored in this environment"
    echo "  • Backups and monitoring will be automatically configured"
    echo ""
    echo -e "${YELLOW}SECURITY REQUIREMENTS:${NC}"
    echo "  • You MUST provide a valid email for production alerts"
    echo "  • Automated backups will be enabled by default"
    echo "  • All secrets will be stored in GCP Secret Manager"
    echo "  • Workload Identity Federation provides keyless authentication"
    echo ""
    echo -e "${BLUE}COST CONSIDERATIONS:${NC}"
    echo "  • Production uses higher-tier database (db-custom-2-4096)"
    echo "  • Production keeps minimum 1 instance running (no cold starts)"
    echo "  • Production has longer backup retention (30 days)"
    echo ""
    
    if ! confirm "I understand this is for PRODUCTION and will incur costs" "n"; then
        log_warning "Production setup cancelled"
        log_info "Use ./scripts/setup-dev.sh for development environment"
        exit 1
    fi
    
    echo ""
    if ! confirm "I confirm I want to proceed with PRODUCTION setup" "n"; then
        log_warning "Production setup cancelled"
        exit 1
    fi
}

production_safety_checks() {
    log_step "Production safety checks..."
    
    # Check if we're accidentally in a dev project
    local current_project=$(gcloud config get-value project 2>/dev/null || echo "")
    if [[ $current_project == *"-dev"* ]]; then
        log_warning "Currently active GCP project appears to be a development project: $current_project"
        if ! confirm "Are you sure you want to use this project for PRODUCTION?" "n"; then
            log_info "Please switch to your production GCP project first"
            exit 1
        fi
    fi
    
    # Check if dev environment exists in same repo
    if [ -f "$INFRASTRUCTURE_DIR/environments/dev/terraform.tfvars" ]; then
        log_info "Development environment detected in this repository"
        echo "  This is good - you should have separate dev and prod environments"
    fi
    
    log_success "Safety checks passed"
}

collect_production_configuration() {
    log_step "Production configuration setup"
    
    echo ""
    log_info "We need production-specific information:"
    echo ""
    
    # GCP Project ID (no default, must be explicit)
    PROJECT_ID=$(prompt_input "GCP Project ID for PRODUCTION (separate from dev)" "^[a-z][a-z0-9-]{4,28}[a-z0-9]$" "Project ID must be 6-30 chars, lowercase letters, numbers, hyphens only")
    
    # Verify it's different from dev if dev exists
    if [ -f "$INFRASTRUCTURE_DIR/environments/dev/terraform.tfvars" ]; then
        local dev_project=$(grep "^project_id" "$INFRASTRUCTURE_DIR/environments/dev/terraform.tfvars" | cut -d'"' -f2 2>/dev/null || echo "")
        if [ "$PROJECT_ID" = "$dev_project" ]; then
            log_error "Production project ID cannot be the same as development project ID"
            log_error "Development project: $dev_project"
            log_error "Use a separate GCP project for production"
            exit 1
        fi
    fi
    
    # Appwrite Project ID (production)
    echo ""
    log_warning "Use a SEPARATE Appwrite project for production (not the same as dev)"
    APPWRITE_PROJECT_ID=$(prompt_input "Appwrite Project ID for PRODUCTION" "^[a-zA-Z0-9]{24}$" "Appwrite Project ID must be 24 characters")
    
    # Alert Email (required for production)
    echo ""
    log_info "Production monitoring requires an email for alerts and notifications"
    ALERT_EMAIL=$(prompt_input "Alert email for production monitoring" "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" "Please enter a valid email address")
    
    # App Name (production, no suffix)
    local default_app_name=$(echo "$GITHUB_REPO" | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    APP_NAME=$(prompt_input "Application name for production (no -prod suffix)" "^[a-z][a-z0-9-]*[a-z0-9]$" "App name must start with letter, contain only lowercase letters, numbers, hyphens" "$default_app_name")
    
    # Backup retention
    BACKUP_RETENTION=$(prompt_input "Backup retention days (7-365)" "^([7-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-5])$" "Backup retention must be between 7 and 365 days" "30")
    
    echo ""
    log_info "Production configuration summary:"
    echo "  GCP Project: $PROJECT_ID"
    echo "  GitHub Repo: $GITHUB_OWNER/$GITHUB_REPO"
    echo "  Appwrite ID: $APPWRITE_PROJECT_ID"
    echo "  Alert Email: $ALERT_EMAIL"
    echo "  App Name: $APP_NAME"
    echo "  Backup Retention: $BACKUP_RETENTION days"
    echo ""
    
    if ! confirm "Proceed with this PRODUCTION configuration?" "y"; then
        log_warning "Production setup cancelled by user"
        exit 1
    fi
}

production_configuration_review() {
    log_step "Production configuration review"
    
    echo ""
    log_info "${BLUE}Final Production Configuration Review:${NC}"
    echo ""
    echo -e "${GREEN}Infrastructure:${NC}"
    echo "  • GCP Project: $PROJECT_ID"
    echo "  • Environment: Production"
    echo "  • Region: us-central1 (configurable)"
    echo ""
    echo -e "${GREEN}Application:${NC}"
    echo "  • App Name: $APP_NAME"
    echo "  • GitHub Repository: $GITHUB_OWNER/$GITHUB_REPO"
    echo "  • Appwrite Project: $APPWRITE_PROJECT_ID"
    echo ""
    echo -e "${GREEN}Production Features:${NC}"
    echo "  • Database: High-performance tier (db-custom-2-4096)"
    echo "  • Scaling: 1-100 instances (min 1 for no cold starts)"
    echo "  • Monitoring: Email alerts to $ALERT_EMAIL"
    echo "  • Backups: Enabled, $BACKUP_RETENTION days retention"
    echo "  • Security: Workload Identity Federation (keyless)"
    echo ""
    echo -e "${YELLOW}Expected Monthly Costs (estimate):${NC}"
    echo "  • Database: ~\$25-50/month (db-custom-2-4096)"
    echo "  • Cloud Run: ~\$10-30/month (depends on traffic)"
    echo "  • Storage/Secrets: ~\$1-5/month"
    echo "  • Total: ~\$36-85/month (varies by usage)"
    echo ""
    
    if ! confirm "Deploy this PRODUCTION configuration?" "n"; then
        log_warning "Production deployment cancelled"
        exit 1
    fi
    
    echo ""
    log_warning "Final confirmation: This will create PRODUCTION resources with REAL COSTS"
    if ! confirm "I understand the costs and want to proceed" "n"; then
        log_warning "Production deployment cancelled"
        exit 1
    fi
}

production_validation() {
    log_step "Production environment validation..."
    
    cd "$ENV_DIR" || exit 1
    
    # Check if outputs are available
    local outputs_available=true
    
    # Test Terraform outputs
    if ! terraform output project_id >/dev/null 2>&1; then
        outputs_available=false
    fi
    
    if [ "$outputs_available" = true ]; then
        log_success "Infrastructure deployed successfully"
        
        # Validate production-specific features
        local security_checklist=$(terraform output -raw security_checklist 2>/dev/null || echo "")
        if [ -n "$security_checklist" ]; then
            echo ""
            log_info "Production Security Status:"
            echo "$security_checklist"
        fi
        
        # Show production URLs if available
        local urls=$(terraform output -json production_urls 2>/dev/null || echo "{}")
        if [ "$urls" != "{}" ]; then
            echo ""
            log_info "Production URLs will be available after first deployment:"
            echo "$urls" | jq -r 'to_entries[] | "  \(.key): \(.value)"' 2>/dev/null || echo "  URLs will be shown after first GitHub Actions deployment"
        fi
    else
        log_warning "Could not validate all outputs - infrastructure may still be deploying"
    fi
}

show_production_summary() {
    local project_id="$1"
    local github_owner="$2"
    local github_repo="$3"
    
    echo ""
    log_header "🚀 Production Environment Setup Complete!"
    
    echo -e "${GREEN}${CHECKMARK}${NC} GCP Project: $project_id"
    echo -e "${GREEN}${CHECKMARK}${NC} GitHub Repository: $github_owner/$github_repo"
    echo -e "${GREEN}${CHECKMARK}${NC} Workload Identity Federation configured"
    echo -e "${GREEN}${CHECKMARK}${NC} GitHub Actions variables set"
    echo -e "${GREEN}${CHECKMARK}${NC} Production monitoring enabled"
    echo -e "${GREEN}${CHECKMARK}${NC} Automated backups configured"
    echo -e "${GREEN}${CHECKMARK}${NC} Alert email: $ALERT_EMAIL"
    
    echo ""
    echo -e "${BLUE}${ARROW}${NC} Next steps for production deployment:"
    echo "  1. Push your code to 'main' branch to trigger production deployment"
    echo "  2. Monitor deployment: https://github.com/$github_owner/$github_repo/actions"
    echo "  3. View production resources: https://console.cloud.google.com/home/dashboard?project=$project_id"
    echo "  4. Set up custom domain (if needed) in Cloud Run console"
    echo "  5. Configure SSL certificates for your domain"
    
    echo ""
    echo -e "${YELLOW}${WARNING}${NC} Important production reminders:"
    echo "  • Monitor costs in GCP Console: https://console.cloud.google.com/billing"
    echo "  • Check alert email: $ALERT_EMAIL for any issues"
    echo "  • Review security settings regularly"
    echo "  • Test backup/restore procedures"
    echo "  • Keep Terraform state secure (stored in GCS bucket)"
    
    echo ""
    echo -e "${PURPLE}${ROCKET}${NC} Your production environment is ready!"
    echo -e "${GREEN}${LOCK}${NC} Secure, scalable, and monitored!"
}

# Handle script interruption
cleanup() {
    echo ""
    log_warning "Production setup interrupted!"
    echo ""
    echo "For production safety, please review any partial changes in GCP Console."
    echo "You can safely re-run this script to continue where you left off."
    exit 1
}

# Trap Ctrl+C
trap cleanup INT

# Ensure we're in the right directory
if [ ! -f "$INFRASTRUCTURE_DIR/environments/prod/main.tf" ]; then
    log_error "This script must be run from the project root directory"
    log_error "Expected to find: infrastructure/environments/prod/main.tf"
    exit 1
fi

# Check if already configured (similar to dev but with production warnings)
check_existing_production_setup() {
    if [ -f "$ENV_DIR/terraform.tfvars" ] && [ -f "$ENV_DIR/backend.tf" ]; then
        log_warning "Production environment appears to be already configured"
        log_warning "This is PRODUCTION - be careful with changes"
        
        if confirm "Do you want to reconfigure PRODUCTION?" "n"; then
            log_info "Proceeding with production reconfiguration..."
        else
            log_info "Skipping to deployment steps..."
            return 1
        fi
    fi
    return 0
}

# Enhanced generate_terraform_vars for production
generate_terraform_vars() {
    local env_dir="$1"
    local project_id="$2"
    local github_owner="$3"
    local github_repo="$4"
    local appwrite_project_id="$5"
    local alert_email="$6"
    
    log_step "Generating production terraform.tfvars..."
    
    local tfvars_file="$env_dir/terraform.tfvars"
    
    # Copy from example if not exists
    if [ ! -f "$tfvars_file" ]; then
        cp "$env_dir/terraform.tfvars.example" "$tfvars_file"
    fi
    
    # Update values with production-specific settings
    sed -i.bak "s/your-project-.*-123/$project_id/g" "$tfvars_file"
    sed -i.bak "s/your-username/$github_owner/g" "$tfvars_file"
    sed -i.bak "s/your-repo-name/$github_repo/g" "$tfvars_file"
    sed -i.bak "s/507f1f77bcf86cd799439011/$appwrite_project_id/g" "$tfvars_file"
    sed -i.bak "s/alerts@yourcompany.com/$alert_email/g" "$tfvars_file"
    
    # Set production-specific values
    if [ -n "$APP_NAME" ]; then
        sed -i.bak "s/my-awesome-app/$APP_NAME/g" "$tfvars_file"
    fi
    
    if [ -n "$BACKUP_RETENTION" ]; then
        sed -i.bak "s/backup_retention_days = 30/backup_retention_days = $BACKUP_RETENTION/g" "$tfvars_file"
    fi
    
    # Remove backup file
    rm -f "$tfvars_file.bak"
    
    log_success "Generated production terraform.tfvars with your configuration"
}

# Run main function
main "$@"