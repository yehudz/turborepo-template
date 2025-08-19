import fs from 'fs-extra'
import path from 'path'
import { execa } from 'execa'
import simpleGit from 'simple-git'
import chalk from 'chalk'
import { 
  checkDirectoryExists, 
  removeDirectory, 
  getTemplateUrl,
  kebabToTitle 
} from './utils.js'

export async function setupProject(config) {
  const { projectName, projectPath, apps, deployment, installDeps } = config
  
  // Check if directory already exists
  if (await checkDirectoryExists(projectPath)) {
    throw new Error(`Directory ${projectName} already exists`)
  }

  // Clone the template repository
  await cloneTemplate(projectPath)
  
  // Remove unwanted apps
  await removeUnwantedApps(projectPath, apps)
  
  // Update configuration files
  await updateProjectConfig(projectPath, config)
  
  // Remove deployment files if not needed
  if (deployment === 'none') {
    await removeDeploymentFiles(projectPath)
  }
  
  // Remove CLI package from the generated project
  await removeDirectory(path.join(projectPath, 'packages/create-yehudz-template'))
  
  // Install dependencies if requested
  if (installDeps) {
    await installDependencies(projectPath)
  }
  
  // Initialize git repository
  await initializeGit(projectPath)
}

async function cloneTemplate(projectPath) {
  const git = simpleGit()
  
  await git.clone(getTemplateUrl(), projectPath, [
    '--depth', '1', // Shallow clone for faster download
    '--branch', 'main' // Use main branch
  ])
  
  // Remove .git directory to start fresh
  await removeDirectory(path.join(projectPath, '.git'))
}

async function removeUnwantedApps(projectPath, selectedApps) {
  const allApps = ['web', 'admin', 'mobile', 'api']
  const appsToRemove = allApps.filter(app => !selectedApps.includes(app))
  
  for (const app of appsToRemove) {
    const appPath = path.join(projectPath, 'apps', app)
    if (await checkDirectoryExists(appPath)) {
      await removeDirectory(appPath)
      console.log(chalk.gray(`   Removed ${app} app`))
    }
  }
}

async function updateProjectConfig(projectPath, config) {
  const { projectName, apps } = config
  
  // Update root package.json
  await updateRootPackageJson(projectPath, projectName, apps)
  
  // Update turbo.json
  await updateTurboConfig(projectPath, apps)
  
  // Update deployment workflow
  await updateDeploymentWorkflow(projectPath, apps)
  
  // Update README.md
  await updateReadme(projectPath, projectName, apps)
}

async function updateRootPackageJson(projectPath, projectName, apps) {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageJson = await fs.readJson(packageJsonPath)
  
  // Update name
  packageJson.name = projectName
  
  // Update scripts based on selected apps
  const newScripts = { ...packageJson.scripts }
  
  if (apps.includes('mobile')) {
    newScripts['mobile:start'] = 'turbo run start --filter mobile'
    newScripts['mobile:build'] = 'turbo run build --filter mobile'
  }
  
  if (!apps.includes('admin')) {
    // Remove admin-specific scripts if they exist
    delete newScripts['admin:dev']
    delete newScripts['admin:build']
  }
  
  packageJson.scripts = newScripts
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  console.log(chalk.gray(`   Updated package.json for ${projectName}`))
}

async function updateTurboConfig(projectPath, apps) {
  const turboConfigPath = path.join(projectPath, 'turbo.json')
  const turboConfig = await fs.readJson(turboConfigPath)
  
  // Filter pipeline based on selected apps
  const pipeline = { ...turboConfig.pipeline }
  
  if (!apps.includes('mobile')) {
    // Remove mobile-specific tasks
    delete pipeline['mobile#start']
    delete pipeline['mobile#build']
  }
  
  turboConfig.pipeline = pipeline
  
  await fs.writeJson(turboConfigPath, turboConfig, { spaces: 2 })
  console.log(chalk.gray('   Updated turbo.json'))
}

async function updateDeploymentWorkflow(projectPath, apps) {
  const workflowPath = path.join(projectPath, '.github/workflows/deploy.yml')
  
  if (!await fs.pathExists(workflowPath)) return
  
  let workflow = await fs.readFile(workflowPath, 'utf-8')
  
  // Remove admin app steps if not selected
  if (!apps.includes('admin')) {
    workflow = workflow.replace(/- name: Build admin app[\s\S]*?pnpm --filter admin build\n/g, '')
    workflow = workflow.replace(/- name: Create Dockerfile for admin app[\s\S]*?EOF\n/g, '')
    workflow = workflow.replace(/if.*DEPLOY_ADMIN.*admin app[\s\S]*?fi\n/g, '')
    workflow = workflow.replace(/- name: Deploy admin app to Cloud Run[\s\S]*?GOOGLE_CLOUD_BUCKET_NAME:latest\n/g, '')
  }
  
  await fs.writeFile(workflowPath, workflow)
  console.log(chalk.gray('   Updated deployment workflow'))
}

async function updateReadme(projectPath, projectName, apps) {
  const readmePath = path.join(projectPath, 'README.md')
  
  if (!await fs.pathExists(readmePath)) return
  
  let readme = await fs.readFile(readmePath, 'utf-8')
  
  // Update project title
  readme = readme.replace(/# .*/, `# ${kebabToTitle(projectName)}`)
  
  // Add app-specific sections
  const appSections = []
  
  if (apps.includes('web')) {
    appSections.push('- 🌐 **Web App**: Next.js 15 with App Router')
  }
  
  if (apps.includes('admin')) {
    appSections.push('- 🔧 **Admin Dashboard**: Management interface')
  }
  
  if (apps.includes('mobile')) {
    appSections.push('- 📱 **Mobile App**: Expo + React Native')
  }
  
  if (apps.includes('api')) {
    appSections.push('- 🚀 **API Backend**: Express.js server')
  }
  
  // Insert app sections after the main description
  const appSectionText = `\n## 🚀 What's Included\n\n${appSections.join('\n')}\n`
  readme = readme.replace(/(\n## .*?)/, `${appSectionText}$1`)
  
  await fs.writeFile(readmePath, readme)
  console.log(chalk.gray('   Updated README.md'))
}

async function removeDeploymentFiles(projectPath) {
  const deploymentFiles = [
    '.github/workflows/deploy.yml',
    'infrastructure'
  ]
  
  for (const file of deploymentFiles) {
    const filePath = path.join(projectPath, file)
    if (await fs.pathExists(filePath)) {
      await removeDirectory(filePath)
      console.log(chalk.gray(`   Removed ${file}`))
    }
  }
}

async function installDependencies(projectPath) {
  console.log(chalk.blue('📦 Installing dependencies...'))
  
  try {
    await execa('pnpm', ['install'], {
      cwd: projectPath,
      stdio: 'inherit'
    })
    console.log(chalk.green('✅ Dependencies installed'))
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not install dependencies automatically'))
    console.log(chalk.gray('   Run `pnpm install` manually after setup'))
  }
}

async function initializeGit(projectPath) {
  try {
    const git = simpleGit(projectPath)
    await git.init()
    await git.add('.')
    await git.commit('Initial commit from create-yehudz-template')
    console.log(chalk.gray('   Initialized git repository'))
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not initialize git repository'))
  }
}