import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface RateLimitOptions {
  keyPrefix: string;
  identifier?: string; // Optional email/account identifier
  limit?: number;     // Max attempts allowed
  windowMs?: number;  // Window duration in milliseconds
}

/**
 * Checks if a request should be rate-limited based on options.
 * Resolves the client IP address from request headers.
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<{
  success: boolean;
  remaining: number;
  resetTime: Date;
}> {
  const headerList = await headers();
  // Resolve client IP (handles proxies like Vercel/Cloudflare)
  const clientIp = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  
  // Scope by IP and optional email identifier to prevent locking other accounts on same IP
  const key = options.identifier 
    ? `${options.keyPrefix}:${clientIp}:${options.identifier.toLowerCase().trim()}`
    : `${options.keyPrefix}:${clientIp}`;
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // Default: 15 minutes
  
  const now = new Date();
  
  // 1. Fetch existing rate limit record
  const record = await prisma.rateLimit.findUnique({
    where: { key },
  });
  
  if (!record) {
    // No record exists: create a new rate limit window
    const expireAt = new Date(now.getTime() + windowMs);
    await prisma.rateLimit.create({
      data: {
        key,
        points: 1,
        expireAt,
      },
    });
    return {
      success: true,
      remaining: limit - 1,
      resetTime: expireAt,
    };
  }
  
  // 2. Check if current rate limit window has expired
  if (now > record.expireAt) {
    // Window expired: reset the rate limit window
    const expireAt = new Date(now.getTime() + windowMs);
    await prisma.rateLimit.update({
      where: { key },
      data: {
        points: 1,
        expireAt,
      },
    });
    return {
      success: true,
      remaining: limit - 1,
      resetTime: expireAt,
    };
  }
  
  // 3. If within the active window, check if limit is exceeded
  if (record.points >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.expireAt,
    };
  }
  
  // 4. Increment the points for the active window
  const updated = await prisma.rateLimit.update({
    where: { key },
    data: {
      points: {
        increment: 1,
      },
    },
  });
  
  return {
    success: true,
    remaining: limit - updated.points,
    resetTime: record.expireAt,
  };
}
