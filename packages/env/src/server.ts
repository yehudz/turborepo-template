import { z } from 'zod'

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Server Configuration
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  
  // API Keys (add as needed)
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').optional(),
  
  // Clerk Configuration
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
})

export const serverEnv = serverSchema.parse(process.env)

export type ServerEnv = z.infer<typeof serverSchema>