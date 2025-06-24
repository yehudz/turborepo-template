import { auth, currentUser } from '@clerk/nextjs/server'
import type { UserRoleE, AuthErrorE } from '@repo/types'
import type { PermissionI, RolePermissionsI } from '@repo/types'

// Get current user server-side
export async function getCurrentUser() {
  try {
    const user = await currentUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get current user ID server-side
export async function getCurrentUserId() {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

// Check if user is authenticated server-side
export async function isAuthenticated() {
  try {
    const { userId } = await auth()
    return !!userId
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

// Role-based access control
const rolePermissions: RolePermissionsI = {
  admin: [
    { action: '*', resource: '*' }, // Admin has all permissions
  ],
  user: [
    { action: 'read', resource: 'add-your-resource-here' },
    { action: 'create', resource: 'add-your-resource-here' },
    { action: 'update', resource: 'add-your-resource-here' },
    { action: 'delete', resource: 'add-your-resource-here' },
    { action: 'read', resource: 'add-your-resource-here' },
    { action: 'update', resource: 'add-your-resource-here' },
  ],
}

// Check if user has permission
export function hasPermission(
  userRole: UserRoleE | undefined,
  action: string,
  resource: string
): boolean {
  if (!userRole) return false
  
  const permissions = rolePermissions[userRole] || []
  
  return permissions.some(permission => {
    // Admin wildcard check
    if (permission.action === '*' && permission.resource === '*') {
      return true
    }
    
    // Exact match
    if (permission.action === action && permission.resource === resource) {
      return true
    }
    
    // Wildcard action
    if (permission.action === '*' && permission.resource === resource) {
      return true
    }
    
    // Wildcard resource
    if (permission.action === action && permission.resource === '*') {
      return true
    }
    
    return false
  })
}

// Get user role from metadata
export function getUserRole(user: any): UserRoleE | undefined {
  return user?.publicMetadata?.role as UserRoleE | undefined
}

// Check if user is admin
export function isAdmin(user: any): boolean {
  return getUserRole(user) === 'admin'
}

// Route protection helpers
export async function requireAuth(): Promise<{ userId: string }> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  return { userId }
}

export async function requireRole(requiredRole: UserRoleE): Promise<{ userId: string; user: any }> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  // Note: In a real app, you'd fetch the user and check their role
  // This is a simplified version for the template
  return { userId, user: null }
}

// Error handling - creates error with enum code (message should be localized in the app)
export function createAuthError(type: AuthErrorE, message?: string): Error {
  const error = new Error(message || type)
  error.name = type
  
  return error
}

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Note: Implement proper webhook signature verification
  // This is a placeholder for the template
  return true
}

// Utility to extract user info for database sync
export function extractUserInfo(clerkUser: any) {
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt),
  }
}
