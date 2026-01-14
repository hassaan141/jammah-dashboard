import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export async function withAuth(
    request: NextRequest,
    handler: (user: any, supabase: any) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        const authorization = request.headers.get('authorization')

        if (!authorization) {
            return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const token = authorization.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
        }

        return handler(user, supabase)
    } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
}

export async function withAdminAuth(
    request: NextRequest,
    handler: (user: any, supabase: any) => Promise<NextResponse>
): Promise<NextResponse> {
    return withAuth(request, async (user, supabase) => {
        if (user.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }
        return handler(user, supabase)
    })
}

export async function withMultiAdminAuth(
    request: NextRequest,
    handler: (user: any, supabase: any) => Promise<NextResponse>
): Promise<NextResponse> {
    return withAuth(request, async (user, supabase) => {
        const allowedEmails = [process.env.AWQAT_ADMIN_EMAIL, process.env.ADMIN_EMAIL]
        if (!allowedEmails.includes(user.email)) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }
        return handler(user, supabase)
    })
}

export function getClientIp(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown'
}

