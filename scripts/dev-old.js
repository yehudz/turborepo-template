#!/usr/bin/env node

import { execSync, spawn } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

console.log(chalk.blue.bold('🚀 Development Server\n'))

// Dynamically detect available apps
const appsDir = path.join(process.cwd(), 'apps')
const availableApps = fs.existsSync(appsDir) ? fs.readdirSync(appsDir) : []

const choices = []

if (availableApps.length > 0) {
  choices.push({
    name: '🌐 Web apps (Next.js/Backend apps)',
    value: 'web'
  })
}

if (availableApps.length > 1) {
  choices.push({
    name: '🚀 All apps',
    value: 'all'
  })
}

const { platform } = await inquirer.prompt([
  {
    type: 'list',
    name: 'platform',
    message: 'What would you like to run?',
    choices
  }
])

console.log(chalk.green(`\n🎯 Starting ${platform === 'web' ? 'web' : 'all'} development servers...\n`))

// Simple command execution for all apps
const command = 'turbo run dev --concurrency=15'
console.log(chalk.gray(`Running: ${command}\n`))

// Execute the command
try {
  execSync(`pnpm ${command}`, { stdio: 'inherit' })
} catch (error) {
  console.error(chalk.red('❌ Error starting development servers:'), error.message)
  process.exit(1)
}