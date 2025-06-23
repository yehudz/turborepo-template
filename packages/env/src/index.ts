export { clientEnv, type ClientEnv } from './client'
export { serverEnv, type ServerEnv } from './server'

// Utility function to validate environment variables at runtime
export function validateEnv() {
  try {
    // This will throw if validation fails
    require('./server')
    require('./client')
    return { success: true, error: null }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Environment validation failed' 
    }
  }
}