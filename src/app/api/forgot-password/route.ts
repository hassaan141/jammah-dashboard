import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { forgotPasswordSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate and sanitize input
    const validationResult = forgotPasswordSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    const supabase = await createClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3020'}/reset-password`,
    })

    if (error) {
      // Don't expose whether email exists for security reasons
      console.error('Password reset error:', error)
      return NextResponse.json(
        { message: 'If an account with this email exists, you will receive a password reset email shortly.' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: 'If an account with this email exists, you will receive a password reset email shortly.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
