/**
 * Determines the redirect path based on user email
 */
export function getRedirectPath(email: string): string {
  // Normalize email to lowercase for comparison
  const normalizedEmail = email.toLowerCase().trim()
  
  // Admin dashboard for Jamah Community App
  if (normalizedEmail === 'jamahcommunityapp@gmail.com') {
    return '/admin'
  }
  
  // Awqat dashboard for BC masjid admin
  if (normalizedEmail === 'info@awqat.net') {
    return '/awqat'
  }
  
  // Default to organization profile for regular organizations
  return '/org/profile'
}

/**
 * User role types based on email
 */
export type UserRole = 'admin' | 'awqat' | 'organization'

/**
 * Gets user role based on email
 */
export function getUserRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim()
  
  if (normalizedEmail === 'jamahcommunityapp@gmail.com') {
    return 'admin'
  }
  
  if (normalizedEmail === 'info@awqat.net') {
    return 'awqat'
  }
  
  return 'organization'
}