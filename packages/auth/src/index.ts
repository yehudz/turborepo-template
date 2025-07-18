// Export Appwrite core clients and config
export {
  getClientAppwrite,
  getServerClient,
  getSessionClient,
  appwriteConfig,
} from './config'

// Export auth middleware
export {
  authMiddleware,
  protectedRoutes,
  authPaths,
} from './config'

// Export server-side auth helpers
export {
  getCurrentUser,
  getCurrentUserId,
  getCurrentSession,
  getAuthState,
  isAuthenticated,
  requireAuth,
} from './helpers'

// Export server actions
export {
  signInServerAction,
  signOutServerAction,
} from './actions'

// Export types
export type { User, Session } from './types'