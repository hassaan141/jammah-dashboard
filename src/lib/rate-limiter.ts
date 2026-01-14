interface RateLimitEntry {
    count: number
    resetTime: number
}

class SimpleRateLimiter {
    private store = new Map<string, RateLimitEntry>()
    private maxSize = 10000

    limit(
        identifier: string,
        maxRequests: number,
        windowMs: number
    ): {
        success: boolean
        limit: number
        remaining: number
        reset: number
    } {
        const now = Date.now()

        if (this.store.size > this.maxSize) {
            this.cleanup(now)
        }

        const entry = this.store.get(identifier)

        if (!entry || entry.resetTime < now) {
            this.store.set(identifier, {
                count: 1,
                resetTime: now + windowMs,
            })
            return {
                success: true,
                limit: maxRequests,
                remaining: maxRequests - 1,
                reset: now + windowMs,
            }
        }

        if (entry.count >= maxRequests) {
            return {
                success: false,
                limit: maxRequests,
                remaining: 0,
                reset: entry.resetTime,
            }
        }

        entry.count++
        return {
            success: true,
            limit: maxRequests,
            remaining: maxRequests - entry.count,
            reset: entry.resetTime,
        }
    }

    private cleanup(now: number) {
        const toDelete: string[] = []
        for (const [key, entry] of this.store.entries()) {
            if (entry.resetTime < now) {
                toDelete.push(key)
            }
        }
        toDelete.forEach(key => this.store.delete(key))
    }
}

const rateLimiter = new SimpleRateLimiter()

// 30 requests per minute
export function checkRateLimit(ip: string) {
    return rateLimiter.limit(`general_${ip}`, 30, 60000)
}

// 5 requests per minute for sensitive operations
export function checkStrictRateLimit(ip: string) {
    return rateLimiter.limit(`strict_${ip}`, 5, 60000)
}

// 10 requests per 5 minutes for auth
export function checkAuthRateLimit(ip: string) {
    return rateLimiter.limit(`auth_${ip}`, 10, 300000)
}

