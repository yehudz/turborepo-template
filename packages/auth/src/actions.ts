'use server'

import { cookies } from 'next/headers'
import { getServerClient } from './config'

/**
 * Server-side login action
 */
export async function signInServerAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    // Use admin client to create session
    const serverClient = await getServerClient()
    const { Account } = await import('node-appwrite')
    const serverAccount = new Account(serverClient)
    
    const session = await serverAccount.createEmailPasswordSession(email, password)
    
    // Set server-side session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Server-side login error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }
  }
}

/**
 * Server-side logout action
 */
export async function signOutServerAction() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (sessionCookie) {
      // Delete session from Appwrite
      const serverClient = await getServerClient()
      const { Account } = await import('node-appwrite')
      const serverAccount = new Account(serverClient)
      
      try {
        await serverAccount.deleteSession(sessionCookie.value)
      } catch (sessionError) {
        // Session might already be invalid, continue with cookie cleanup
        console.warn('Error deleting Appwrite session:', sessionError)
      }
    }
    
    // Remove session cookie
    cookieStore.delete('session')
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Server-side logout error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Logout failed' 
    }
  }
}