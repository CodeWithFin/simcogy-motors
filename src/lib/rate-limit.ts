import { NextResponse } from "next/server";

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
};

const store = new Map<string, { count: number; resetAt: number }>();

function cleanup() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) store.delete(key);
  }
}

setInterval(cleanup, 60_000);

export function rateLimit(config: RateLimitConfig) {
  return async function (
    req: Request,
    keyFn?: (req: Request) => string | Promise<string>
  ): Promise<{ success: boolean; response?: NextResponse }> {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    const customKey = keyFn ? await keyFn(req) : null;
    const key = `${config.keyPrefix}:${customKey || ip}`;

    const now = Date.now();
    const record = store.get(key);

    if (!record || record.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + config.windowMs });
      return { success: true };
    }

    if (record.count >= config.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return {
        success: false,
        response: NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Limit": String(config.maxRequests),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(record.resetAt / 1000)),
            },
          }
        ),
      };
    }

    record.count++;
    return {
      success: true,
      response: NextResponse.json(null, {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": String(config.maxRequests - record.count),
          "X-RateLimit-Reset": String(Math.ceil(record.resetAt / 1000)),
        },
      }),
    };
  };
}

export const leadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: "lead",
});

export const tradeInRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
  keyPrefix: "tradein",
});

export const adviserRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
  keyPrefix: "adviser",
});