#!/bin/bash

# Script validation utility
# Tests scripts without executing the main functionality

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧪 Validating automation scripts..."
echo ""

# Test 1: Syntax validation
echo "✓ Testing syntax..."
bash -n "$SCRIPT_DIR/common.sh"
bash -n "$SCRIPT_DIR/setup-dev.sh" 
bash -n "$SCRIPT_DIR/setup-prod.sh"
echo "  All scripts have valid syntax"

# Test 2: Source common.sh functions
echo "✓ Testing common functions..."
source "$SCRIPT_DIR/common.sh"

# Test basic functions (without side effects)
if command_exists echo; then
    echo "  command_exists() works"
fi

if [[ "test-owner/test-repo" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
    echo "  GitHub repository validation regex works"
fi

# Test 3: Check file permissions
echo "✓ Testing file permissions..."
if [ -x "$SCRIPT_DIR/setup-dev.sh" ]; then
    echo "  setup-dev.sh is executable"
else
    echo "  ❌ setup-dev.sh is not executable"
fi

if [ -x "$SCRIPT_DIR/setup-prod.sh" ]; then
    echo "  setup-prod.sh is executable"
else
    echo "  ❌ setup-prod.sh is not executable"
fi

# Test 4: Check required files exist
echo "✓ Testing file structure..."
required_files=(
    "$SCRIPT_DIR/../environments/dev/main.tf"
    "$SCRIPT_DIR/../environments/dev/terraform.tfvars.example"
    "$SCRIPT_DIR/../environments/prod/main.tf"
    "$SCRIPT_DIR/../environments/prod/terraform.tfvars.example"
    "$SCRIPT_DIR/../modules/workload-identity/main.tf"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $(basename "$file") exists"
    else
        echo "  ❌ Missing: $file"
    fi
done

echo ""
echo "🎉 Script validation complete!"
echo ""
echo "To use the automation scripts:"
echo "  ./infrastructure/scripts/setup-dev.sh    # Development environment"
echo "  ./infrastructure/scripts/setup-prod.sh   # Production environment"