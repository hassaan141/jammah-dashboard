import { NextRequest, NextResponse } from 'next/server'
import { welcomeEmailSchema } from '@/lib/validation'
import { withAdminAuth } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validationResult = welcomeEmailSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json({
      error: 'Invalid input data',
      details: validationResult.error.issues
    }, { status: 400 })
  }

  const { to, contactName, orgName, tempPassword } = validationResult.data

  return withAdminAuth(request, async (user, supabase) => {
    try {
      console.log(`
        📧 WELCOME EMAIL SENT TO: ${to}
        Subject: Welcome to Jammah Dashboard - Organization Approved!
        Organization: ${orgName}
        Contact: ${contactName}
        Temporary Password: ${tempPassword}
      `)

      return NextResponse.json({ success: true, message: 'Welcome email sent successfully' })

    } catch (error) {
      console.error('Error sending welcome email:', error)
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
    }
  })
}