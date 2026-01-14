export function getRedirectPath(email: string): string {
  const normalizedEmail = email.toLowerCase().trim()

  if (normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
    return '/admin'
  }

  if (normalizedEmail === process.env.AWQAT_ADMIN_EMAIL?.toLowerCase()) {
    return '/awqat'
  }

  return '/org'
}

export type UserRole = 'admin' | 'awqat' | 'organization'

export function getUserRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim()

  if (normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
    return 'admin'
  }

  if (normalizedEmail === process.env.AWQAT_ADMIN_EMAIL?.toLowerCase()) {
    return 'awqat'
  }

  return 'organization'
}