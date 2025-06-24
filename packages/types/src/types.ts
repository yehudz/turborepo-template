// All type definitions

export type IDT = string | number

// Auth types - using enum instead of union type

export type ClerkWebhookEventT = 
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'session.created'
  | 'session.ended'
  | 'session.removed'
  | 'session.revoked'