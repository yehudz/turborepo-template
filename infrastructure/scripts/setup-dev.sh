#!/bin/bash

# Development Environment Setup Script
# This script automates the complete setup of a development environment

set -e  # Exit on any error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INFRASTRUCTURE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source common functions
source "$SCRIPT_DIR/common.sh"

# Global variables
ENVIRONMENT="dev"
ENV_DIR="$INFRASTRUCTURE_DIR/environments/$ENVIRONMENT"

main() {
    log_header "Turborepo Development Environment Setup"
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Step 1: Prerequisites
    check_prerequisites
    check_gcloud_auth
    check_github_auth
    
    # Step 2: Repository Detection
    detect_github_repo
    
    # Step 3: Collect Configuration
    collect_configuration
    
    # Step 4: GCP Project Setup
    setup_gcp_project "$PROJECT_ID" "$ENVIRONMENT"
    enable_gcp_apis "$PROJECT_ID"
    
    # Step 5: Terraform Backend
    local bucket_name=$(create_terraform_state_bucket "$PROJECT_ID" "$ENVIRONMENT")
    configure_terraform_backend "$bucket_name" "$ENV_DIR/backend.tf"
    
    # Step 6: Generate Configuration
    generate_terraform_vars "$ENV_DIR" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO" "$APPWRITE_PROJECT_ID"
    
    # Step 7: Deploy Infrastructure
    run_terraform "$ENV_DIR" "$ENVIRONMENT"
    
    # Step 8: Configure GitHub
    configure_github_variables "$GITHUB_OWNER" "$GITHUB_REPO" "$ENV_DIR"
    
    # Step 9: Test and Summary
    test_authentication "$PROJECT_ID"
    show_summary "$ENVIRONMENT" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO"
}

collect_configuration() {
    log_step "Configuration setup"
    
    echo ""
    log_info "We need some information to set up your development environment:"
    echo ""
    
    # GCP Project ID
    local default_project="${GITHUB_OWNER}-${GITHUB_REPO}-dev"
    PROJECT_ID=$(prompt_input "GCP Project ID for development" "^[a-z][a-z0-9-]{4,28}[a-z0-9]$" "Project ID must be 6-30 chars, lowercase letters, numbers, hyphens only" "$default_project")
    
    # Appwrite Project ID
    APPWRITE_PROJECT_ID=$(prompt_input "Appwrite Project ID" "^[a-zA-Z0-9]{24}$" "Appwrite Project ID must be 24 characters")
    
    # App Name (optional)
    local default_app_name=$(echo "$GITHUB_REPO" | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    APP_NAME=$(prompt_input "Application name (for resource naming)" "^[a-z][a-z0-9-]*[a-z0-9]$" "App name must start with letter, contain only lowercase letters, numbers, hyphens" "$default_app_name")
    
    echo ""
    log_info "Configuration summary:"
    echo "  GCP Project: $PROJECT_ID"
    echo "  GitHub Repo: $GITHUB_OWNER/$GITHUB_REPO"
    echo "  Appwrite ID: $APPWRITE_PROJECT_ID"
    echo "  App Name: $APP_NAME"
    echo ""
    
    if ! confirm "Proceed with this configuration?" "y"; then
        log_warning "Setup cancelled by user"
        exit 1
    fi
}

# Handle script interruption
cleanup() {
    echo ""
    log_warning "Setup interrupted!"
    echo ""
    echo "You can safely re-run this script to continue where you left off."
    echo "The script is designed to be idempotent and will skip completed steps."
    exit 1
}

# Trap Ctrl+C
trap cleanup INT

# Ensure we're in the right directory
if [ ! -f "$INFRASTRUCTURE_DIR/environments/dev/main.tf" ]; then
    log_error "This script must be run from the project root directory"
    log_error "Expected to find: infrastructure/environments/dev/main.tf"
    exit 1
fi

# Check if already configured
check_existing_setup() {
    if [ -f "$ENV_DIR/terraform.tfvars" ] && [ -f "$ENV_DIR/backend.tf" ]; then
        log_warning "Development environment appears to be already configured"
        
        if confirm "Do you want to reconfigure it?" "n"; then
            log_info "Proceeding with reconfiguration..."
        else
            log_info "Skipping to deployment steps..."
            return 1
        fi
    fi
    return 0
}

# Validate existing terraform.tfvars
validate_terraform_vars() {
    local tfvars_file="$ENV_DIR/terraform.tfvars"
    
    if [ ! -f "$tfvars_file" ]; then
        return 1
    fi
    
    # Check if file has been customized (not just the example)
    if grep -q "your-project-.*-123\|your-username\|your-repo-name\|507f1f77bcf86cd799439011" "$tfvars_file"; then
        log_warning "terraform.tfvars file has placeholder values"
        return 1
    fi
    
    log_success "terraform.tfvars file looks configured"
    return 0
}

# Quick setup mode for existing configurations
quick_setup() {
    log_header "Quick Setup Mode - Existing Configuration Detected"
    
    # Extract values from existing terraform.tfvars
    PROJECT_ID=$(grep "^project_id" "$ENV_DIR/terraform.tfvars" | cut -d'"' -f2)
    GITHUB_OWNER=$(grep "^github_owner" "$ENV_DIR/terraform.tfvars" | cut -d'"' -f2)
    GITHUB_REPO=$(grep "^github_repository" "$ENV_DIR/terraform.tfvars" | cut -d'"' -f2)
    
    log_info "Using existing configuration:"
    echo "  Project: $PROJECT_ID"
    echo "  Repository: $GITHUB_OWNER/$GITHUB_REPO"
    echo ""
    
    if ! confirm "Continue with existing configuration?" "y"; then
        log_info "Starting fresh configuration..."
        return 1
    fi
    
    # Set active project
    gcloud config set project "$PROJECT_ID" >/dev/null 2>&1
    
    # Skip to deployment
    run_terraform "$ENV_DIR" "$ENVIRONMENT"
    configure_github_variables "$GITHUB_OWNER" "$GITHUB_REPO" "$ENV_DIR"
    test_authentication "$PROJECT_ID"
    show_summary "$ENVIRONMENT" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO"
    exit 0
}

# Check for development-specific warnings
dev_warnings() {
    echo ""
    log_info "${BLUE}Development Environment Notes:${NC}"
    echo "  • This creates a development environment with minimal resources"
    echo "  • Database: db-f1-micro (free tier eligible)"
    echo "  • Scaling: 0-10 instances (cost-effective)"
    echo "  • No production monitoring or alerting"
    echo "  • Perfect for testing and development"
    echo ""
}

# Enhanced main function with existing setup detection
main() {
    log_header "Turborepo Development Environment Setup"
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Development-specific notes
    dev_warnings
    
    # Step 1: Prerequisites
    check_prerequisites
    check_gcloud_auth
    check_github_auth
    
    # Step 2: Repository Detection
    detect_github_repo
    
    # Step 3: Check for existing setup
    if ! check_existing_setup; then
        if validate_terraform_vars; then
            quick_setup
        fi
    fi
    
    # Step 4: Collect Configuration
    collect_configuration
    
    # Step 5: GCP Project Setup
    setup_gcp_project "$PROJECT_ID" "$ENVIRONMENT"
    enable_gcp_apis "$PROJECT_ID"
    
    # Step 6: Terraform Backend
    local bucket_name=$(create_terraform_state_bucket "$PROJECT_ID" "$ENVIRONMENT")
    configure_terraform_backend "$bucket_name" "$ENV_DIR/backend.tf"
    
    # Step 7: Generate Configuration
    generate_terraform_vars "$ENV_DIR" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO" "$APPWRITE_PROJECT_ID"
    
    # Step 8: Deploy Infrastructure
    run_terraform "$ENV_DIR" "$ENVIRONMENT"
    
    # Step 9: Configure GitHub
    configure_github_variables "$GITHUB_OWNER" "$GITHUB_REPO" "$ENV_DIR"
    
    # Step 10: Test and Summary
    test_authentication "$PROJECT_ID"
    show_summary "$ENVIRONMENT" "$PROJECT_ID" "$GITHUB_OWNER" "$GITHUB_REPO"
}

# Run main function
main "$@"