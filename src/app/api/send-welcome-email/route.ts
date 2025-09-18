import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This is a placeholder API endpoint for sending welcome emails
// In production, you'd integrate with an email service like:
// - Resend (resend.com) - recommended for Next.js
// - SendGrid 
// - AWS SES
// - Postmark

export async function POST(request: NextRequest) {
  try {
    const { to, contactName, orgName, tempPassword } = await request.json()

    // Verify the request is coming from an admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Replace with actual email service
    // Example with Resend:
    /*
    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'noreply@yourjammahdomain.com',
      to: [to],
      subject: 'Welcome to Jammah Dashboard - Organization Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Jammah Dashboard!</h2>
          <p>Dear ${contactName},</p>
          <p>Congratulations! Your organization "${orgName}" has been approved for the Jammah Dashboard.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          
          <p><strong>🔒 IMPORTANT:</strong> You must change your password on first login for security.</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/signin" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
            Login to Dashboard
          </a>
          
          <p>Best regards,<br>The Jammah Team</p>
        </div>
      `
    })
    */

    // For now, just log the email content (development)
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
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    )
  }
}