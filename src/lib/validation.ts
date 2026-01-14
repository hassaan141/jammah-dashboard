/**
 * Input Validation Schemas
 * Uses Zod to validate and sanitize all user inputs
 */

import { z } from 'zod'

// Sanitize strings to prevent XSS
const sanitizedString = (minLength: number, maxLength: number) =>
    z.string()
        .trim()
        .min(minLength)
        .max(maxLength)
        .transform(str => str.replace(/[<>]/g, ''))

// Organization data validation
export const organizationSchema = z.object({
    organizationId: z.string().uuid().optional(),
    name: sanitizedString(1, 200),
    address: sanitizedString(1, 500),
    city: sanitizedString(1, 100),
    province_state: sanitizedString(1, 100),
    country: sanitizedString(1, 100),
    postal_code: sanitizedString(1, 20),
    contact_name: sanitizedString(1, 200),
    contact_email: z.string().email().max(200).toLowerCase().trim(),
    contact_phone: sanitizedString(1, 50),
    website: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    facebook: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    instagram: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    twitter: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    donate_link: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
})

// Application approval validation
export const applicationIdSchema = z.object({
    applicationId: z.string().uuid(),
    orgId: z.string().uuid().optional(),
})

// Email validation
export const emailSchema = z.string().email().max(200).toLowerCase().trim()

// UUID validation
export const uuidSchema = z.string().uuid()

// Password validation
export const passwordSchema = z.string().min(8).max(100)

// Forgot password validation
export const forgotPasswordSchema = z.object({
    email: emailSchema,
})

// Organization data for creation (different field names)
const organizationCreationDataSchema = z.object({
    organization_name: sanitizedString(1, 200),
    organization_type: sanitizedString(1, 100),
    address: sanitizedString(1, 500),
    city: sanitizedString(1, 100),
    province_state: sanitizedString(1, 100),
    country: sanitizedString(1, 100),
    postal_code: sanitizedString(1, 20),
    contact_name: sanitizedString(1, 200),
    contact_email: z.string().email().max(200).toLowerCase().trim(),
    contact_phone: sanitizedString(1, 50),
    website: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    facebook: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    instagram: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    twitter: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
    prayer_times_url: z.string().url().max(500).trim().optional().or(z.literal('')).nullable(),
})

// Organization creation validation (for admin)
export const createOrganizationSchema = z.object({
    applicationId: z.string().uuid(),
    organizationData: organizationCreationDataSchema,
    temporaryPassword: passwordSchema,
})

// Geocode validation
export const geocodeSchema = z.object({
    address: sanitizedString(1, 1000),
})

// Timezone validation
export const timezoneSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
})

// Welcome email validation
export const welcomeEmailSchema = z.object({
    to: emailSchema,
    contactName: sanitizedString(1, 200),
    orgName: sanitizedString(1, 200),
    tempPassword: z.string().min(1).max(100),
})

// Masjid ingestion key validation
export const masjidIngestionKeySchema = z.object({
    organizationId: z.string().uuid(),
})

