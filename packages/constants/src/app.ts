// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  FILE_UPLOAD: 120000, // 2 minutes
  DEBOUNCE_SEARCH: 300, // 300ms
  TOAST_DURATION: 5000, // 5 seconds
  SESSION_WARNING: 300000, // 5 minutes
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'app-theme',
  LANGUAGE: 'app-language',
  USER_PREFERENCES: 'user-preferences',
  RECENT_SEARCHES: 'recent-searches',
  DRAFT_CONTENT: 'draft-content',
} as const

// App Limits
export const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 5,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'',
  FILE_NAME: 'yyyy-MM-dd_HH-mm-ss',
} as const

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
  STRONG_PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
} as const