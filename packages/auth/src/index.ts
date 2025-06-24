// Re-export Clerk components and hooks for convenience
export {
  ClerkProvider,
  SignIn,
  SignUp,
  UserButton,
  UserProfile,
  SignInButton,
  SignUpButton,
  SignOutButton,
  useUser,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
} from '@clerk/nextjs'

export {
  auth,
  currentUser,
} from '@clerk/nextjs/server'

// Export our custom utilities
export {
  authMiddleware,
  clerkAppearance,
  authPaths,
} from './config'

export {
  getCurrentUser,
  getCurrentUserId,
  isAuthenticated,
  hasPermission,
  getUserRole,
  isAdmin,
  requireAuth,
  requireRole,
  createAuthError,
  verifyWebhookSignature,
  extractUserInfo,
} from './helpers'

// Types are exported from @repo/types