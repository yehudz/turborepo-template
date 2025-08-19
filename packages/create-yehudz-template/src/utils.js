import fs from 'fs-extra'
import path from 'path'

export function validateProjectName(name) {
  if (!name) {
    return { valid: false, message: 'Project name is required' }
  }
  
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    return { 
      valid: false, 
      message: 'Project name can only contain letters, numbers, dashes, and underscores' 
    }
  }
  
  if (name.length < 2) {
    return { valid: false, message: 'Project name must be at least 2 characters long' }
  }
  
  if (name.length > 50) {
    return { valid: false, message: 'Project name must be less than 50 characters' }
  }
  
  return { valid: true }
}

export function getProjectPath(projectName) {
  return path.resolve(process.cwd(), projectName)
}

export async function checkDirectoryExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath)
    return stat.isDirectory()
  } catch {
    return false
  }
}

export async function ensureDirectoryExists(dirPath) {
  await fs.ensureDir(dirPath)
}

export async function removeDirectory(dirPath) {
  await fs.remove(dirPath)
}

export async function copyDirectory(src, dest) {
  await fs.copy(src, dest)
}

export function getTemplateUrl() {
  return 'https://github.com/yehudazeytim/turborepo-template.git'
}

export function kebabToTitle(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}