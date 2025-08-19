import path from 'path'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { setupProject } from './generator.js'
import { validateProjectName, getProjectPath } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp() {
  console.log(chalk.blue.bold('\n🚀 Welcome to Yehudz Template Generator!\n'))
  
  // Get project name
  const projectName = process.argv[2]
  if (!projectName) {
    console.error(chalk.red('❌ Please provide a project name:'))
    console.log(chalk.gray('   npx create-yehudz-template my-project'))
    process.exit(1)
  }

  // Validate project name
  const validation = validateProjectName(projectName)
  if (!validation.valid) {
    console.error(chalk.red(`❌ ${validation.message}`))
    process.exit(1)
  }

  const projectPath = getProjectPath(projectName)

  // Show project info
  console.log(chalk.cyan(`📁 Project: ${chalk.bold(projectName)}`))
  console.log(chalk.cyan(`📍 Location: ${chalk.gray(projectPath)}\n`))

  // Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'apps',
      message: '✨ Which apps would you like to include?',
      choices: [
        {
          name: 'Web app (Next.js)',
          value: 'web',
          checked: true,
          disabled: 'Always included'
        },
        {
          name: 'Admin dashboard (Next.js)',
          value: 'admin', 
          checked: true
        },
        {
          name: 'Mobile app (Expo + React Native)',
          value: 'mobile',
          checked: false
        },
        {
          name: 'API backend (Express)',
          value: 'api',
          checked: false
        }
      ]
    },
    {
      type: 'list',
      name: 'deployment',
      message: '☁️  Which cloud platform would you like to deploy to?',
      choices: [
        {
          name: 'Google Cloud Platform (GCP)',
          value: 'gcp'
        },
        {
          name: 'AWS (coming soon)',
          value: 'aws',
          disabled: 'Not available yet'
        },
        {
          name: 'Skip deployment setup',
          value: 'none'
        }
      ],
      default: 'gcp'
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: '📦 Install dependencies after setup?',
      default: true
    }
  ])

  // Always include web app
  answers.apps.push('web')
  answers.apps = [...new Set(answers.apps)] // Remove duplicates

  console.log(chalk.green('\n📋 Configuration:'))
  console.log(chalk.gray(`   Apps: ${answers.apps.join(', ')}`))
  console.log(chalk.gray(`   Deployment: ${answers.deployment}`))
  console.log(chalk.gray(`   Install deps: ${answers.installDeps ? 'Yes' : 'No'}\n`))

  // Generate project
  const spinner = ora('🔧 Setting up your project...').start()
  
  try {
    await setupProject({
      projectName,
      projectPath,
      ...answers
    })
    
    spinner.succeed(chalk.green('✅ Project created successfully!'))
    
    // Show next steps
    console.log(chalk.blue.bold('\n🎉 Next steps:'))
    console.log(chalk.gray(`   cd ${projectName}`))
    
    if (!answers.installDeps) {
      console.log(chalk.gray('   pnpm install'))
    }
    
    if (answers.apps.includes('mobile')) {
      console.log(chalk.gray('   pnpm mobile:start  # Start Expo dev server'))
    }
    
    console.log(chalk.gray('   pnpm dev           # Start development servers'))
    
    if (answers.deployment === 'gcp') {
      console.log(chalk.gray('   # Follow README.md for GCP deployment setup'))
    }
    
    console.log(chalk.blue('\n🚀 Happy coding!\n'))
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Failed to create project'))
    throw error
  }
}