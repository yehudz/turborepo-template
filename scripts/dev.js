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

if (availableApps.filter(app => !app.includes('mobile')).length > 0) {
  choices.push({
    name: '🌐 Web only (Next.js/Backend apps)',
    value: 'web'
  })
}

if (availableApps.includes('mobile')) {
  choices.push({
    name: '📱 Mobile only (Expo app)', 
    value: 'mobile'
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

console.log(chalk.green(`\n🎯 Starting ${platform === 'web' ? 'web' : platform === 'mobile' ? 'mobile' : 'all'} development servers...\n`))

if (platform === 'all') {
  // For 'all', we need to run multiple commands in parallel
  const webApps = availableApps.filter(app => app !== 'mobile')
  const hasWebApps = webApps.length > 0
  const hasMobile = availableApps.includes('mobile')
  
  if (hasWebApps) {
    const webFilters = webApps.map(app => `--filter=${app}`).join(' ')
    console.log(chalk.gray(`Running: turbo run dev ${webFilters} --concurrency=15\n`))
  }
  
  if (hasMobile) {
    console.log(chalk.gray('Running: turbo run dev --filter=mobile\n'))
  }
  
  const processes = []
  
  if (hasWebApps) {
    const webArgs = ['turbo', 'run', 'dev', ...webApps.map(app => `--filter=${app}`), '--concurrency=15']
    const webProcess = spawn('pnpm', webArgs, {
      stdio: 'inherit',
      shell: true
    })
    processes.push(webProcess)
  }
  
  if (hasMobile) {
    const mobileProcess = spawn('pnpm', ['turbo', 'run', 'dev', '--filter=mobile'], {
      stdio: 'inherit', 
      shell: true
    })
    processes.push(mobileProcess)
  }

  // Handle process termination
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down servers...'))
    processes.forEach(proc => proc.kill('SIGINT'))
    process.exit(0)
  })
  
  // Wait for any process to exit
  processes.forEach((proc, index) => {
    proc.on('exit', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`❌ Development server ${index + 1} failed`))
        processes.forEach(p => p.kill('SIGINT'))
        process.exit(code)
      }
    })
  })
} else {
  // Handle single platform cases
  let command
  
  switch (platform) {
    case 'web':
      // Run only non-mobile apps
      const webApps = availableApps.filter(app => app !== 'mobile')
      const webFilters = webApps.map(app => `--filter=${app}`).join(' ')
      command = `turbo run dev ${webFilters} --concurrency=15`
      break
    case 'mobile':
      // Run only mobile app
      command = 'turbo run dev --filter=mobile'
      break
  }

  console.log(chalk.gray(`Running: ${command}\n`))

  // Execute the command
  try {
    execSync(`pnpm ${command}`, { stdio: 'inherit' })
  } catch (error) {
    console.error(chalk.red('❌ Error starting development servers:'), error.message)
    process.exit(1)
  }
}