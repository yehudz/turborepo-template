#!/usr/bin/env node

import { spawn } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

console.log(chalk.blue.bold('🚀 Development Server Menu\n'))

// Check if mobile app exists
const mobileAppPath = path.join(process.cwd(), 'apps', 'mobile')
const hasMobileApp = fs.existsSync(mobileAppPath)

const choices = [
  {
    name: '🌐 Web only (admin, web, mobile web, api)',
    value: 'web'
  }
]

if (hasMobileApp) {
  choices.push(
    {
      name: '📱 iOS Simulator (mobile, api)',
      value: 'ios'
    },
    {
      name: '🤖 Android Emulator (mobile, api)',
      value: 'android'
    },
    {
      name: '📱🤖 Both mobile apps (iOS + Android, api)',
      value: 'mobile'
    }
  )
}

choices.push({
  name: '🚀 All apps (web, admin, mobile iOS + Android, api)',
  value: 'all'
})

const { platform } = await inquirer.prompt([
  {
    type: 'list',
    name: 'platform',
    message: 'What would you like to run?',
    choices
  }
])

console.log(chalk.green(`\n🎯 Starting ${platform} development servers...\n`))

// Helper function to run commands
function runCommand(command, args = [], options = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  })
}

// Helper function to open mobile IDEs
function openMobileIDE(platform) {
  const mobileDir = path.join(process.cwd(), 'apps', 'mobile')
  return spawn('npx', ['cap', 'open', platform], {
    stdio: 'inherit',
    cwd: mobileDir
  })
}

let processes = []

try {
  switch (platform) {
    case 'web':
      console.log(chalk.cyan('Starting API server on port 3002...'))
      console.log(chalk.cyan('Starting Admin app on port 3000...'))
      console.log(chalk.cyan('Starting Web app on port 3001...'))
      
      if (hasMobileApp) {
        console.log(chalk.cyan('Starting Mobile web app on port 3003...'))
        console.log('')
        
        // Run all web apps and API using turbo
        processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--filter=api', '--filter=admin', '--filter=web', '--filter=mobile']))
      } else {
        console.log('')
        
        // Run web apps and API using turbo
        processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--filter=api', '--filter=admin', '--filter=web']))
      }
      break

    case 'ios':
      console.log(chalk.cyan('Starting API server on port 3002...'))
      console.log(chalk.cyan('Starting Mobile app on port 3003...'))
      console.log(chalk.cyan('Opening Xcode...\n'))
      
      // Start API and mobile in parallel
      processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--filter=api', '--filter=mobile']))
      
      // Wait a bit for servers to start, then open Xcode
      setTimeout(() => {
        console.log(chalk.cyan('\nOpening Xcode...\n'))
        openMobileIDE('ios')
      }, 3000)
      break

    case 'android':
      console.log(chalk.cyan('Starting API server on port 3002...'))
      console.log(chalk.cyan('Starting Mobile app on port 3003...'))
      console.log(chalk.cyan('Opening Android Studio...\n'))
      
      // Start API and mobile in parallel
      processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--filter=api', '--filter=mobile']))
      
      // Wait a bit for servers to start, then open Android Studio
      setTimeout(() => {
        console.log(chalk.cyan('\nOpening Android Studio...\n'))
        openMobileIDE('android')
      }, 3000)
      break

    case 'mobile':
      console.log(chalk.cyan('Starting API server on port 3002...'))
      console.log(chalk.cyan('Starting Mobile app on port 3003...'))
      console.log(chalk.cyan('Opening Xcode and Android Studio...\n'))
      
      // Start API and mobile in parallel
      processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--filter=api', '--filter=mobile']))
      
      // Wait for servers, then open both IDEs
      setTimeout(() => {
        console.log(chalk.cyan('\nOpening Xcode...\n'))
        openMobileIDE('ios')
      }, 3000)
      
      setTimeout(() => {
        console.log(chalk.cyan('\nOpening Android Studio...\n'))
        openMobileIDE('android')
      }, 4000)
      break

    case 'all':
      console.log(chalk.cyan('Starting all development servers...'))
      console.log(chalk.cyan('API on port 3002'))
      console.log(chalk.cyan('Admin on port 3000'))
      console.log(chalk.cyan('Web on port 3001'))
      
      if (hasMobileApp) {
        console.log(chalk.cyan('Mobile on port 3003'))
        console.log(chalk.cyan('Will launch iOS and Android after servers start...'))
      }
      console.log('')
      
      // Start all apps using turbo
      processes.push(runCommand('pnpm', ['turbo', 'run', 'dev', '--concurrency=15']))
      
      if (hasMobileApp) {
        // Open IDEs after servers start
        setTimeout(() => {
          console.log(chalk.cyan('\nOpening Xcode...\n'))
          openMobileIDE('ios')
        }, 5000)
        
        setTimeout(() => {
          console.log(chalk.cyan('\nOpening Android Studio...\n'))
          openMobileIDE('android')
        }, 6000)
      }
      break
  }

  console.log(chalk.gray('\nPress Ctrl+C to stop all servers\n'))

} catch (error) {
  console.error(chalk.red('❌ Error starting development servers:'), error.message)
  process.exit(1)
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Shutting down development servers...'))
  
  // Kill all child processes
  processes.forEach(proc => {
    if (proc && !proc.killed) {
      proc.kill('SIGTERM')
    }
  })
  
  console.log(chalk.green('✅ All servers stopped\n'))
  process.exit(0)
})

// Keep the script running
process.stdin.resume()