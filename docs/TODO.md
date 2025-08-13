# 📋 Feature Development TODO Tracker

> **Purpose:** This document is for keeping track of all todos for each feature development. This document should only contain the tasks of the current feature being developed. It should be cleared after a feature has been completed and marked as "Ready to start next feature or Jira ticket".

---

## 🚀 Current Feature: Plug-and-Play Infrastructure Implementation with Workload Identity Federation

**Status:** In Development  
**Started:** [Current Date]  
**Target Completion:** TBD

## Phase 1: Infrastructure Restructuring

### 1.1 Create New Directory Structure
- [ ] Create `infrastructure/environments/` directory
- [ ] Create `infrastructure/environments/dev/` directory
- [ ] Create `infrastructure/environments/prod/` directory
- [ ] Create `infrastructure/modules/` directory
- [ ] Create `infrastructure/modules/workload-identity/` directory
- [ ] Create `infrastructure/modules/infrastructure/` directory
- [ ] Create `infrastructure/modules/github-integration/` directory
- [ ] Create `infrastructure/scripts/` directory

### 1.2 Move Existing Terraform Files
- [ ] Copy current `main.tf` to `infrastructure/modules/infrastructure/main.tf`
- [ ] Copy current `variables.tf` to `infrastructure/modules/infrastructure/variables.tf`
- [ ] Copy current `outputs.tf` to `infrastructure/modules/infrastructure/outputs.tf`
- [ ] Copy current `versions.tf` to `infrastructure/modules/infrastructure/versions.tf`
- [ ] Update paths and references in moved files

## Phase 2: Update Infrastructure for Appwrite

### 2.1 Remove Clerk References
- [ ] Remove all Clerk variables from `modules/infrastructure/variables.tf`
- [ ] Remove Clerk secrets from `modules/infrastructure/main.tf` locals
- [ ] Update terraform.tfvars.example to remove Clerk variables
- [ ] Update infrastructure README to remove Clerk references

### 2.2 Add Appwrite Configuration
- [ ] Add `appwrite_project_id` variable to `modules/infrastructure/variables.tf`
- [ ] Add `appwrite_url` variable to `modules/infrastructure/variables.tf` (with default)
- [ ] Update secrets in `modules/infrastructure/main.tf` to include Appwrite variables
- [ ] Remove JWT_SECRET and other unused variables

## Phase 3: Create Workload Identity Federation Module

### 3.1 Create WIF Module Structure
- [ ] Create `modules/workload-identity/main.tf`
- [ ] Create `modules/workload-identity/variables.tf`
- [ ] Create `modules/workload-identity/outputs.tf`
- [ ] Create `modules/workload-identity/versions.tf`

### 3.2 Implement WIF Resources
- [ ] Add Workload Identity Pool resource
- [ ] Add GitHub OIDC Provider resource
- [ ] Add Service Account for GitHub Actions
- [ ] Add IAM policy bindings for WIF
- [ ] Add necessary IAM roles for deployment (Cloud Run admin, Secret Manager, etc.)
- [ ] Add conditional logic for repository-specific access

### 3.3 WIF Module Variables
- [ ] Add `project_id` variable
- [ ] Add `github_repository` variable (format: "owner/repo")
- [ ] Add `environment` variable (dev/prod)
- [ ] Add `service_account_id` variable
- [ ] Add optional `additional_repositories` variable for multi-repo access

### 3.4 WIF Module Outputs
- [ ] Output Workload Identity Provider ID
- [ ] Output Service Account email
- [ ] Output GitHub repository configuration details

## Phase 4: Create GitHub Integration Module

### 4.1 GitHub Integration Module Structure
- [ ] Create `modules/github-integration/main.tf`
- [ ] Create `modules/github-integration/variables.tf`
- [ ] Create `modules/github-integration/outputs.tf`
- [ ] Create `modules/github-integration/versions.tf`

### 4.2 Implement GitHub Resources
- [ ] Add GitHub repository secrets configuration (using GitHub provider)
- [ ] Add WIF_PROVIDER secret
- [ ] Add WIF_SERVICE_ACCOUNT secret
- [ ] Add PROJECT_ID variable
- [ ] Add REGION variable
- [ ] Add ARTIFACT_REGISTRY_REPO variable

## Phase 5: Environment-Specific Configurations

### 5.1 Dev Environment Setup
- [ ] Create `environments/dev/main.tf` that calls all modules
- [ ] Create `environments/dev/variables.tf` with dev-specific variables
- [ ] Create `environments/dev/outputs.tf` with important outputs
- [ ] Create `environments/dev/backend.tf` for remote state (Cloud Storage)
- [ ] Create `environments/dev/terraform.tfvars.example`

### 5.2 Prod Environment Setup
- [ ] Create `environments/prod/main.tf` that calls all modules
- [ ] Create `environments/prod/variables.tf` with prod-specific variables
- [ ] Create `environments/prod/outputs.tf` with important outputs
- [ ] Create `environments/prod/backend.tf` for remote state (Cloud Storage)
- [ ] Create `environments/prod/terraform.tfvars.example`

### 5.3 Environment Differences Configuration
- [ ] Configure dev environment with lower resource limits
- [ ] Configure prod environment with higher resource limits
- [ ] Set different database tiers for dev/prod
- [ ] Configure different backup retention for dev/prod
- [ ] Set different scaling limits for dev/prod

## Phase 6: Automation Scripts

### 6.1 Dev Setup Script
- [ ] Create `scripts/setup-dev.sh`
- [ ] Add GCP project creation/selection logic
- [ ] Add Terraform backend bucket creation
- [ ] Add terraform init, plan, apply automation
- [ ] Add error handling and validation
- [ ] Add GitHub repository detection from git remote
- [ ] Add confirmation prompts for destructive actions

### 6.2 Prod Setup Script
- [ ] Create `scripts/setup-prod.sh`
- [ ] Add GCP project creation/selection logic
- [ ] Add Terraform backend bucket creation
- [ ] Add terraform init, plan, apply automation
- [ ] Add error handling and validation
- [ ] Add GitHub repository detection from git remote
- [ ] Add confirmation prompts for destructive actions

### 6.3 GitHub Configuration Script
- [ ] Create `scripts/configure-github.sh`
- [ ] Add GitHub CLI integration for setting repository secrets
- [ ] Add automatic detection of WIF provider and service account
- [ ] Add validation of GitHub repository access
- [ ] Add error handling for missing GitHub CLI or permissions

### 6.4 Utility Scripts
- [ ] Create `scripts/destroy-dev.sh` for cleanup
- [ ] Create `scripts/destroy-prod.sh` for cleanup
- [ ] Create `scripts/switch-environment.sh` for easy switching
- [ ] Create `scripts/validate-setup.sh` for post-deployment validation

## Phase 7: CI/CD Pipeline Implementation

### 7.1 GitHub Actions Directory Structure
- [ ] Create `.github/workflows/` directory
- [ ] Create workflow templates for dev and prod

### 7.2 Dev Deployment Workflow
- [ ] Create `.github/workflows/deploy-dev.yml`
- [ ] Add trigger on push to `dev` branch
- [ ] Add WIF authentication steps
- [ ] Add Docker build and push to Artifact Registry
- [ ] Add Cloud Run deployment steps
- [ ] Add database migration steps
- [ ] Add environment validation steps

### 7.3 Prod Deployment Workflow
- [ ] Create `.github/workflows/deploy-prod.yml`
- [ ] Add trigger on push to `main` branch
- [ ] Add manual approval requirement
- [ ] Add WIF authentication steps
- [ ] Add Docker build and push to Artifact Registry
- [ ] Add Cloud Run deployment steps
- [ ] Add database migration steps
- [ ] Add post-deployment validation

### 7.4 Infrastructure Workflow
- [ ] Create `.github/workflows/terraform-plan.yml`
- [ ] Add trigger on PR to infrastructure files
- [ ] Add Terraform plan for both dev and prod
- [ ] Add comment on PR with plan results
- [ ] Add security scanning for Terraform files

### 7.5 Utility Workflows
- [ ] Create `.github/workflows/validate-env.yml` for environment validation
- [ ] Create `.github/workflows/cleanup.yml` for resource cleanup
- [ ] Add workflow for automated dependency updates

## Phase 8: Documentation Updates

### 8.1 Update Infrastructure README
- [ ] Rewrite `infrastructure/README.md` with new structure
- [ ] Add Workload Identity Federation explanation
- [ ] Add environment separation documentation
- [ ] Add troubleshooting section for WIF
- [ ] Add cost optimization notes for dev/prod

### 8.2 Update Main README
- [ ] Update deployment section in main `README.md`
- [ ] Add links to infrastructure documentation
- [ ] Update environment variable references
- [ ] Add dev/prod deployment workflow explanation

### 8.3 Create Deployment Guide
- [ ] Create `docs/DEPLOYMENT.md` with step-by-step deployment guide
- [ ] Add GCP project setup instructions
- [ ] Add GitHub repository configuration
- [ ] Add troubleshooting common issues
- [ ] Add environment switching guide

### 8.4 Update Existing Documentation
- [ ] Update `docs/GITHUB_DEPLOYMENT_SETUP.md` with WIF instructions
- [ ] Update `docs/ARCHITECTURE.md` with new infrastructure architecture
- [ ] Add infrastructure diagrams if needed

## Phase 9: Testing and Validation

### 9.1 Dev Environment Testing
- [ ] Test dev setup script with fresh GCP project
- [ ] Validate WIF authentication works in GitHub Actions
- [ ] Test deployment pipeline to dev environment
- [ ] Validate database connectivity and migrations
- [ ] Test application functionality in dev environment

### 9.2 Prod Environment Testing
- [ ] Test prod setup script with fresh GCP project
- [ ] Validate WIF authentication works for prod
- [ ] Test manual approval workflow
- [ ] Validate prod deployment pipeline
- [ ] Test environment separation (dev/prod isolation)

### 9.3 End-to-End Testing
- [ ] Test complete developer workflow from clone to deployed app
- [ ] Validate environment variables and secrets management
- [ ] Test rollback procedures
- [ ] Validate monitoring and logging setup
- [ ] Test cleanup and destroy procedures

## Phase 10: Security and Optimization

### 10.1 Security Review
- [ ] Review IAM permissions for least privilege
- [ ] Validate Secret Manager access patterns
- [ ] Review VPC and network security
- [ ] Validate Workload Identity Federation configuration
- [ ] Add security scanning to CI/CD pipeline

### 10.2 Cost Optimization
- [ ] Review resource configurations for cost efficiency
- [ ] Add budget alerts and monitoring
- [ ] Optimize container images for faster deploys
- [ ] Configure appropriate scaling limits
- [ ] Add cost estimation in deployment pipeline

### 10.3 Performance Optimization
- [ ] Optimize Docker build process
- [ ] Configure appropriate resource limits
- [ ] Add health checks and monitoring
- [ ] Optimize database configuration
- [ ] Add caching strategies

## Phase 11: Final Integration and Cleanup

### 11.1 Clean Up Old Files
- [ ] Remove old infrastructure files from root
- [ ] Update .gitignore for new structure
- [ ] Remove unused scripts or documentation
- [ ] Clean up terraform.tfvars.example

### 11.2 Final Testing
- [ ] Complete end-to-end test of entire setup
- [ ] Validate all documentation is accurate
- [ ] Test with fresh repository clone
- [ ] Validate all scripts work as expected

### 11.3 Prepare for Production
- [ ] Create release notes for infrastructure changes
- [ ] Update version tags and changelog
- [ ] Prepare migration guide for existing deployments
- [ ] Create rollback procedures documentation

---

## 📋 Prerequisites for Implementation

### Required Tools
- [ ] Terraform >= 1.0
- [ ] Google Cloud CLI
- [ ] GitHub CLI (for automated secret management)
- [ ] Docker (for testing container builds)

### Required Permissions
- [ ] GCP Project Owner or Editor role
- [ ] GitHub repository admin access
- [ ] Ability to create GitHub repository secrets

### Required Information
- [ ] GitHub repository name (owner/repo format)
- [ ] GCP project IDs for dev and prod
- [ ] Appwrite project ID
- [ ] Database passwords (or auto-generation preference)

---

## 🎯 Success Criteria

By the end of this implementation:
1. ✅ Developers can deploy to GCP with 3 commands
2. ✅ Dev and prod environments are completely isolated
3. ✅ Workload Identity Federation provides keyless authentication
4. ✅ CI/CD pipeline deploys automatically on branch pushes
5. ✅ All secrets are managed automatically via Terraform
6. ✅ Documentation is complete and accurate
7. ✅ Setup is truly plug-and-play for new projects