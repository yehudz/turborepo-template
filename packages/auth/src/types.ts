import type { Models } from 'appwrite'

// Simple Appwrite auth user - only authentication data
export interface User {
  $id: string // Appwrite user ID
  email: string // Email for authentication
  name: string // Name from authentication
  emailVerification: boolean // Email verification status
  $createdAt: string // When auth account was created
  $updatedAt: string // When auth account was updated
}

// Appwrite Session type
export type Session = Models.Session