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
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'DATABASE_URL'
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'JWT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_URL'
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
  console.log('   - Get Clerk keys from: https://dashboard.clerk.com');
  console.log('   - Generate JWT secret: openssl rand -base64 32');
  console.log('   - Update database URL if needed');
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

// Clerk keys validation
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (clerkPubKey && clerkSecretKey) {
  if (clerkPubKey.startsWith('pk_test_') && clerkSecretKey.startsWith('sk_test_')) {
    console.log('✅ Clerk: Test environment keys detected');
  } else if (clerkPubKey.startsWith('pk_live_') && clerkSecretKey.startsWith('sk_live_')) {
    console.log('✅ Clerk: Production environment keys detected');
  } else {
    console.log('⚠️  Clerk: Key format validation failed - check your keys');
    hasWarnings = true;
  }
}

// Database URL validation
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  if (dbUrl.startsWith('file:')) {
    console.log('✅ Database: SQLite (development)');
  } else if (dbUrl.startsWith('postgresql://')) {
    console.log('✅ Database: PostgreSQL (production)');
  } else {
    console.log('⚠️  Database: Unrecognized database URL format');
    hasWarnings = true;
  }
}

// JWT Secret validation
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret && jwtSecret.length < 32) {
  console.log('⚠️  JWT_SECRET: Should be at least 32 characters long');
  hasWarnings = true;
} else if (jwtSecret) {
  console.log('✅ JWT_SECRET: Length validation passed');
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Environment validation FAILED');
  console.log('\n📋 Next steps:');
  console.log('1. Update your .env.local file with actual values');
  console.log('2. Get Clerk keys from: https://dashboard.clerk.com');
  console.log('3. Generate JWT secret: openssl rand -base64 32');
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