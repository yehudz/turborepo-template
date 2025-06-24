import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
])

// Clerk configuration - simplified version
export const authMiddleware = clerkMiddleware(async (auth, req) => {
  // Allow the request to proceed for now
  // In a real app, you'd implement proper protection logic here
  return NextResponse.next()
})

// Clerk appearance customization
export const clerkAppearance = {
  layout: {
    logoImageUrl: '/logo.svg',
    socialButtonsVariant: 'iconButton' as const,
  },
  variables: {
    colorPrimary: '#000000',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#000000',
  },
  elements: {
    formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm',
    card: 'shadow-none border border-gray-200',
    headerTitle: 'text-gray-900',
    headerSubtitle: 'text-gray-500',
  },
}

// Default redirect paths
export const authPaths = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  afterSignIn: '/dashboard',
  afterSignUp: '/dashboard',
  userProfile: '/profile',
} as const