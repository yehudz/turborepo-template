#!/usr/bin/env node

import { execSync, spawn } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'

console.log(chalk.blue.bold('🚀 Development Server\n'))

const choices = [
  {
    name: '🌐 Web only (Next.js apps)',
    value: 'web'
  },
  {
    name: '📱 Mobile only (Expo app)', 
    value: 'mobile'
  },
  {
    name: '🚀 Web + Mobile (all apps)',
    value: 'all'
  }
]

const { platform } = await inquirer.prompt([
  {
    type: 'list',
    name: 'platform',
    message: 'What would you like to run?',
    choices
  }
])

console.log(chalk.green(`\n🎯 Starting ${platform === 'web' ? 'web' : platform === 'mobile' ? 'mobile' : 'all'} development servers...\n`))

let command

switch (platform) {
  case 'web':
    // Run only web and admin apps
    command = 'turbo run dev --filter="!mobile" --concurrency=15'
    break
  case 'mobile':
    // Run only mobile app
    command = 'turbo run start --filter=mobile'
    break
  case 'all':
    // Run all apps including mobile
    command = 'turbo run dev --filter="!mobile" --concurrency=15 & turbo run start --filter=mobile'
    break
}

console.log(chalk.gray(`Running: ${command}\n`))

// Execute the command
try {
  if (platform === 'all') {
    // For 'all', we need to run multiple commands in parallel
    const webProcess = spawn('pnpm', ['turbo', 'run', 'dev', '--filter=!mobile', '--concurrency=15'], {
      stdio: 'inherit',
      shell: true
    })
    
    const mobileProcess = spawn('pnpm', ['turbo', 'run', 'start', '--filter=mobile'], {
      stdio: 'inherit', 
      shell: true
    })

    // Handle process termination
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Shutting down servers...'))
      webProcess.kill('SIGINT')
      mobileProcess.kill('SIGINT')
      process.exit(0)
    })
  } else {
    // For single platform, run normally
    execSync(`pnpm ${command}`, { stdio: 'inherit' })
  }
} catch (error) {
  console.error(chalk.red('❌ Error starting development servers:'), error.message)
  process.exit(1)
}