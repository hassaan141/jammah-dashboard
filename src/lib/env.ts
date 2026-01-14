const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ADMIN_EMAIL',
  'OPENROUTE_API_KEY',
] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

if (process.env.NODE_ENV === 'production') {
  validateEnv()
}

