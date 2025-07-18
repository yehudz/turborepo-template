import { getServerClient, getSessionClient } from './config'
import { cookies } from 'next/headers'
import type { Session, User } from './types'
import type { Models } from 'appwrite'

/**
 * Get current user session on the server side
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (!sessionCookie) {
      return null
    }

    const serverClient = await getServerClient()
    const { Account } = await import('node-appwrite')
    const serverAccount = new Account(serverClient)
    
    const session = await serverAccount.getSession(sessionCookie.value)
    return session as Session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

/**
 * Get current user on the server side (Appwrite auth user only)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (!sessionCookie) {
      return null
    }

    // Use session client for user-specific operations
    const sessionClient = getSessionClient(sessionCookie.value)
    const { Account } = await import('appwrite')
    const sessionAccount = new Account(sessionClient)
    
    const appwriteUser: Models.User<Models.Preferences> = await sessionAccount.get()
    
    // Return simple auth user
    const user: User = {
      $id: appwriteUser.$id,
      email: appwriteUser.email,
      name: appwriteUser.name,
      emailVerification: appwriteUser.emailVerification,
      $createdAt: appwriteUser.$createdAt,
      $updatedAt: appwriteUser.$updatedAt,
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.$id || null
}

/**
 * Get complete authentication state for server-side rendering
 */
export async function getAuthState(): Promise<{
  isAuthenticated: boolean
  user: User | null
  session: Session | null
}> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (!sessionCookie) {
      return {
        isAuthenticated: false,
        user: null,
        session: null
      }
    }

    // Use session client approach
    const sessionClient = getSessionClient(sessionCookie.value)
    const { Account } = await import('appwrite')
    const sessionAccount = new Account(sessionClient)
    
    const appwriteUser: Models.User<Models.Preferences> = await sessionAccount.get()
    
    const user: User = {
      $id: appwriteUser.$id,
      email: appwriteUser.email,
      name: appwriteUser.name,
      emailVerification: appwriteUser.emailVerification,
      $createdAt: appwriteUser.$createdAt,
      $updatedAt: appwriteUser.$updatedAt,
    }

    return {
      isAuthenticated: true,
      user,
      session: null
    }
  } catch (error) {
    console.error('Error getting auth state:', error)
    return {
      isAuthenticated: false,
      user: null,
      session: null
    }
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const authState = await getAuthState()
  return authState.isAuthenticated
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await getCurrentSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}
