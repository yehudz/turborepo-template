#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * Validates that all required environment variables are set before starting development.
 * Run with: node scripts/validate-env.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = [
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_URL',
  'DATABASE_URL'
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'NODE_ENV'
];

console.log('🔍 Validating environment variables...\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('❌ Missing .env.local file');
  console.log('');
  console.log('📋 REQUIRED: Create your environment file:');
  console.log('   cp .env.example .env.local');
  console.log('');
  console.log('💡 Then open .env.local and replace placeholder values with real ones');
  console.log('   - Get Appwrite project ID from: https://cloud.appwrite.io/console');
  console.log('   - Start Docker Postgres: docker-compose up postgres');
  console.log('');
  process.exit(1);
}

// Load environment variables from .env.local
require('dotenv').config({ path: envLocalPath });

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('🔒 Required Variables:');
REQUIRED_VARS.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`❌ ${varName}: Missing or contains placeholder value`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

console.log('\n🌟 Recommended Variables:');
RECOMMENDED_VARS.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName}: Missing or contains placeholder value`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

// Specific validations
console.log('\n🔍 Specific Validations:');

// Appwrite validation
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const appwriteUrl = process.env.NEXT_PUBLIC_APPWRITE_URL;

if (appwriteProjectId && appwriteUrl) {
  if (appwriteProjectId.length >= 20) {
    console.log('✅ Appwrite: Project ID format looks valid');
  } else {
    console.log('⚠️  Appwrite: Project ID seems too short - check your project ID');
    hasWarnings = true;
  }
  
  if (appwriteUrl.includes('cloud.appwrite.io')) {
    console.log('✅ Appwrite: Using Appwrite Cloud');
  } else if (appwriteUrl.includes('localhost')) {
    console.log('✅ Appwrite: Using self-hosted Appwrite');
  } else {
    console.log('⚠️  Appwrite: Unrecognized Appwrite URL format');
    hasWarnings = true;
  }
}

// Database URL validation
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  if (dbUrl.startsWith('postgresql://')) {
    console.log('✅ Database: PostgreSQL configured');
  } else {
    console.log('⚠️  Database: Expected PostgreSQL URL (postgresql://...)');
    hasWarnings = true;
  }
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Environment validation FAILED');
  console.log('\n📋 Next steps:');
  console.log('1. Update your .env.local file with actual values');
  console.log('2. Get Appwrite project ID from: https://cloud.appwrite.io/console');
  console.log('3. Start Docker Postgres: docker-compose up postgres');
  console.log('4. Run this script again: node scripts/validate-env.js');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Environment validation passed with warnings');
  console.log('\n💡 Consider addressing the warnings above for production use');
  process.exit(0);
} else {
  console.log('✅ Environment validation PASSED');
  console.log('\n🚀 You\'re ready to start development!');
  console.log('   pnpm dev');
  process.exit(0);
}