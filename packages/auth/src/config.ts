import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Client as ClientAppwrite } from 'appwrite'

// Lazy initialization to avoid SSR issues
let _clientAppwrite: ClientAppwrite | null = null
let _serverClient: any = null

// Define protected routes
export const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
]

// Basic auth middleware - will be enhanced later
export function authMiddleware(request: NextRequest) {
  // For now, allow all requests to proceed
  // This will be enhanced with proper Appwrite session validation
  return NextResponse.next()
}

// Appwrite configuration
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
} as const

// Server-side Appwrite client (with API key for admin operations)
export const getServerClient = async () => {
  if (_serverClient) return _serverClient
  
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const apiKey = process.env.APPWRITE_API_KEY
  
  if (!endpoint || !projectId || !apiKey) {
    throw new Error('Missing Appwrite environment variables')
  }
  
  // Use node-appwrite for server-side operations
  const { Client } = await import('node-appwrite')
  
  _serverClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)
  
  return _serverClient
}

// Client-side Appwrite client (for browser operations)
export const getClientAppwrite = () => {
  if (_clientAppwrite) return _clientAppwrite
  
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  
  if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite environment variables')
  }
  
  _clientAppwrite = new ClientAppwrite()
    .setEndpoint(endpoint)
    .setProject(projectId)
  
  return _clientAppwrite
}

// Session-based client (for authenticated server operations using user session)
export const getSessionClient = (session: string) => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  
  if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite environment variables')
  }
  
  const client = new ClientAppwrite()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSession(session)
  
  return client
}

// Default redirect paths
export const authPaths = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  afterSignIn: '/dashboard',
  afterSignUp: '/dashboard',
  userProfile: '/profile',
} as const