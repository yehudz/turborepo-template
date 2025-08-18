#!/bin/bash

# Common utility functions for setup scripts
# Source this file in other scripts: source "$(dirname "$0")/common.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emoji for better UX
CHECKMARK="✓"
CROSS="✗"
ARROW="→"
ROCKET="🚀"
GEAR="⚙️"
LOCK="🔒"
WARNING="⚠️"
INFO="ℹ️"

# Logging functions
log_info() {
    echo -e "${BLUE}${INFO}${NC} $1"
}

log_success() {
    echo -e "${GREEN}${CHECKMARK}${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}${WARNING}${NC} $1"
}

log_error() {
    echo -e "${RED}${CROSS}${NC} $1"
}

log_step() {
    echo -e "\n${PURPLE}${GEAR}${NC} $1"
}

log_header() {
    echo -e "\n${CYAN}${ROCKET} $1${NC}"
    echo "================================="
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists gcloud; then
        missing_tools+=("gcloud (Google Cloud CLI)")
    fi
    
    if ! command_exists terraform; then
        missing_tools+=("terraform")
    fi
    
    if ! command_exists gh; then
        missing_tools+=("gh (GitHub CLI)")
    fi
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        echo ""
        echo "Please install missing tools and try again."
        echo "Installation guide: https://docs.anthropic.com/en/docs/claude-code"
        exit 1
    fi
    
    log_success "All required tools found"
}

# Detect GitHub repository
detect_github_repo() {
    if [ ! -d .git ]; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    local remote_url=$(git remote get-url origin 2>/dev/null)
    if [ -z "$remote_url" ]; then
        log_error "No git remote 'origin' found"
        exit 1
    fi
    
    # Extract owner/repo from various GitHub URL formats
    if [[ $remote_url =~ github\.com[:/]([^/]+)/([^/]+)(\.git)?$ ]]; then
        GITHUB_OWNER="${BASH_REMATCH[1]}"
        GITHUB_REPO="${BASH_REMATCH[2]}"
        GITHUB_REPO="${GITHUB_REPO%.git}"  # Remove .git suffix if present
        
        log_success "Detected repository: $GITHUB_OWNER/$GITHUB_REPO"
        return 0
    else
        log_error "Could not parse GitHub repository from remote URL: $remote_url"
        exit 1
    fi
}

# Confirm action with user
confirm() {
    local message="$1"
    local default="${2:-n}"
    
    if [ "$default" = "y" ]; then
        prompt="[Y/n]"
    else
        prompt="[y/N]"
    fi
    
    echo -ne "${YELLOW}${message} ${prompt}${NC} "
    read -r response
    
    if [ -z "$response" ]; then
        response="$default"
    fi
    
    case "$response" in
        [yY]|[yY][eE][sS])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Prompt for input with validation
prompt_input() {
    local prompt="$1"
    local validation_regex="$2"
    local error_message="$3"
    local default_value="$4"
    
    while true; do
        if [ -n "$default_value" ]; then
            echo -ne "${CYAN}${prompt} [$default_value]:${NC} "
        else
            echo -ne "${CYAN}${prompt}:${NC} "
        fi
        
        read -r input
        
        # Use default if no input provided
        if [ -z "$input" ] && [ -n "$default_value" ]; then
            input="$default_value"
        fi
        
        # Validate input
        if [ -n "$validation_regex" ] && ! [[ $input =~ $validation_regex ]]; then
            log_error "$error_message"
            continue
        fi
        
        echo "$input"
        return 0
    done
}

# Check if user is authenticated with gcloud
check_gcloud_auth() {
    log_step "Checking Google Cloud authentication..."
    
    if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -1 >/dev/null 2>&1; then
        log_warning "Not authenticated with Google Cloud"
        echo "Please run: gcloud auth login"
        exit 1
    fi
    
    local active_account=$(gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -1)
    log_success "Authenticated as: $active_account"
}

# Check if user is authenticated with GitHub CLI
check_github_auth() {
    log_step "Checking GitHub CLI authentication..."
    
    if ! gh auth status >/dev/null 2>&1; then
        log_warning "Not authenticated with GitHub CLI"
        echo "Please run: gh auth login"
        exit 1
    fi
    
    local github_user=$(gh api user --jq '.login' 2>/dev/null)
    log_success "Authenticated as: $github_user"
}

# Create or validate GCP project
setup_gcp_project() {
    local project_id="$1"
    local environment="$2"
    
    log_step "Setting up GCP project: $project_id"
    
    # Check if project exists
    if gcloud projects describe "$project_id" >/dev/null 2>&1; then
        log_success "Project $project_id exists"
    else
        log_warning "Project $project_id does not exist"
        if confirm "Create new GCP project '$project_id'?" "n"; then
            gcloud projects create "$project_id" --name="Turborepo $environment Environment"
            log_success "Created project: $project_id"
        else
            log_error "Project setup cancelled"
            exit 1
        fi
    fi
    
    # Set as active project
    gcloud config set project "$project_id"
    log_success "Set active project to: $project_id"
}

# Enable required GCP APIs
enable_gcp_apis() {
    local project_id="$1"
    
    log_step "Enabling required GCP APIs..."
    
    local required_apis=(
        "cloudbuild.googleapis.com"
        "run.googleapis.com"
        "artifactregistry.googleapis.com"
        "secretmanager.googleapis.com"
        "iamcredentials.googleapis.com"
        "iam.googleapis.com"
        "storage.googleapis.com"
        "sql-component.googleapis.com"
        "sqladmin.googleapis.com"
    )
    
    for api in "${required_apis[@]}"; do
        echo -n "  Enabling $api... "
        if gcloud services enable "$api" --project="$project_id" >/dev/null 2>&1; then
            echo -e "${GREEN}${CHECKMARK}${NC}"
        else
            echo -e "${RED}${CROSS}${NC}"
            log_error "Failed to enable $api"
            exit 1
        fi
    done
    
    log_success "All APIs enabled successfully"
}

# Create Terraform state bucket
create_terraform_state_bucket() {
    local project_id="$1"
    local environment="$2"
    local bucket_name="${project_id}-terraform-state-${environment}"
    
    log_step "Setting up Terraform state bucket..."
    
    # Check if bucket exists
    if gsutil ls "gs://$bucket_name" >/dev/null 2>&1; then
        log_success "Terraform state bucket already exists: $bucket_name"
    else
        log_info "Creating Terraform state bucket: $bucket_name"
        
        # Create bucket
        gsutil mb -p "$project_id" "gs://$bucket_name"
        
        # Enable versioning
        gsutil versioning set on "gs://$bucket_name"
        
        log_success "Created Terraform state bucket with versioning enabled"
    fi
    
    echo "$bucket_name"
}

# Update backend configuration
configure_terraform_backend() {
    local bucket_name="$1"
    local backend_file="$2"
    
    log_step "Configuring Terraform backend..."
    
    # Create backend configuration
    cat > "$backend_file" <<EOF
terraform {
  backend "gcs" {
    bucket = "$bucket_name"
    prefix = "terraform/state"
  }
}
EOF
    
    log_success "Backend configuration updated"
}

# Generate terraform.tfvars from example
generate_terraform_vars() {
    local env_dir="$1"
    local project_id="$2"
    local github_owner="$3"
    local github_repo="$4"
    local appwrite_project_id="$5"
    local alert_email="$6"
    
    log_step "Generating terraform.tfvars..."
    
    local tfvars_file="$env_dir/terraform.tfvars"
    
    # Copy from example if not exists
    if [ ! -f "$tfvars_file" ]; then
        cp "$env_dir/terraform.tfvars.example" "$tfvars_file"
    fi
    
    # Update values
    sed -i.bak "s/your-project-.*-123/$project_id/g" "$tfvars_file"
    sed -i.bak "s/your-username/$github_owner/g" "$tfvars_file"
    sed -i.bak "s/your-repo-name/$github_repo/g" "$tfvars_file"
    sed -i.bak "s/507f1f77bcf86cd799439011/$appwrite_project_id/g" "$tfvars_file"
    
    # Add alert email for production
    if [ -n "$alert_email" ]; then
        sed -i.bak "s/alerts@yourcompany.com/$alert_email/g" "$tfvars_file"
    fi
    
    # Remove backup file
    rm -f "$tfvars_file.bak"
    
    log_success "Generated terraform.tfvars with your configuration"
}

# Run terraform commands
run_terraform() {
    local env_dir="$1"
    local environment="$2"
    
    log_step "Initializing Terraform..."
    
    cd "$env_dir" || exit 1
    
    # Initialize Terraform
    if terraform init; then
        log_success "Terraform initialized"
    else
        log_error "Terraform initialization failed"
        exit 1
    fi
    
    # Plan
    log_step "Creating Terraform plan..."
    if terraform plan -out="tfplan"; then
        log_success "Terraform plan created"
    else
        log_error "Terraform planning failed"
        exit 1
    fi
    
    # Confirm apply
    echo ""
    log_info "Terraform will create the above resources for your $environment environment."
    if confirm "Apply this plan?" "y"; then
        log_step "Applying Terraform configuration..."
        if terraform apply "tfplan"; then
            log_success "Infrastructure deployed successfully!"
        else
            log_error "Terraform apply failed"
            exit 1
        fi
    else
        log_warning "Terraform apply cancelled"
        exit 1
    fi
    
    # Clean up plan file
    rm -f "tfplan"
}

# Configure GitHub repository variables
configure_github_variables() {
    local github_owner="$1"
    local github_repo="$2"
    local env_dir="$3"
    
    log_step "Configuring GitHub repository variables..."
    
    cd "$env_dir" || exit 1
    
    # Get outputs from Terraform
    local wif_provider=$(terraform output -raw workload_identity_provider 2>/dev/null)
    local service_account=$(terraform output -raw service_account_email 2>/dev/null)
    local project_id=$(terraform output -raw project_id 2>/dev/null)
    local environment=$(terraform output -raw environment 2>/dev/null)
    local region=$(terraform output -raw region 2>/dev/null)
    
    if [ -z "$wif_provider" ] || [ -z "$service_account" ]; then
        log_error "Could not get Terraform outputs. Make sure infrastructure is deployed."
        exit 1
    fi
    
    # Set default region if not available from Terraform
    if [ -z "$region" ]; then
        region="us-central1"
        log_warning "Region not found in Terraform outputs, using default: $region"
    fi
    
    # Set GitHub repository variables
    echo "  Setting WIF_PROVIDER..."
    gh variable set WIF_PROVIDER --body "$wif_provider" --repo "$github_owner/$github_repo"
    
    echo "  Setting WIF_SERVICE_ACCOUNT..."
    gh variable set WIF_SERVICE_ACCOUNT --body "$service_account" --repo "$github_owner/$github_repo"
    
    echo "  Setting PROJECT_ID..."
    gh variable set PROJECT_ID --body "$project_id" --repo "$github_owner/$github_repo"
    
    echo "  Setting ENVIRONMENT..."
    gh variable set ENVIRONMENT --body "$environment" --repo "$github_owner/$github_repo"
    
    echo "  Setting REGION..."
    gh variable set REGION --body "$region" --repo "$github_owner/$github_repo"
    
    echo "  Setting ARTIFACT_REGISTRY_REPO..."
    gh variable set ARTIFACT_REGISTRY_REPO --body "turborepo-images" --repo "$github_owner/$github_repo"
    
    log_success "GitHub repository variables configured"
}

# Test authentication
test_authentication() {
    local project_id="$1"
    
    log_step "Testing Workload Identity Federation..."
    
    # This would require a GitHub Actions workflow to test properly
    # For now, just verify the setup
    log_info "Authentication test requires a GitHub Actions workflow run"
    log_info "Push code to your repository to test the complete deployment pipeline"
}

# Show final summary
show_summary() {
    local environment="$1"
    local project_id="$2"
    local github_owner="$3"
    local github_repo="$4"
    
    echo ""
    log_header "$environment Environment Setup Complete!"
    
    echo -e "${GREEN}${CHECKMARK}${NC} GCP Project: $project_id"
    echo -e "${GREEN}${CHECKMARK}${NC} GitHub Repository: $github_owner/$github_repo"
    echo -e "${GREEN}${CHECKMARK}${NC} Workload Identity Federation configured"
    echo -e "${GREEN}${CHECKMARK}${NC} GitHub Actions variables set"
    
    echo ""
    echo -e "${BLUE}${ARROW}${NC} Next steps:"
    echo "  1. Push your code to trigger GitHub Actions deployment"
    echo "  2. Monitor deployment: https://github.com/$github_owner/$github_repo/actions"
    echo "  3. View GCP resources: https://console.cloud.google.com/home/dashboard?project=$project_id"
    
    echo ""
    echo -e "${PURPLE}${ROCKET}${NC} Your $environment environment is ready!"
}