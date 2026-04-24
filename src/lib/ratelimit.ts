import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiter = { limit: (id: string) => Promise<{ success: boolean }> };

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://")
);

let _ratelimit: Limiter;

if (hasUpstash) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  _ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "10s"),
  });
} else {
  // No-op limiter when Upstash is not configured (e.g. local dev without Redis).
  _ratelimit = { limit: async () => ({ success: true }) };
}

export const ratelimit = _ratelimit;
