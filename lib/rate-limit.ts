type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

// BAGO — generic function, may sariling "namespace" (key) para hindi
// magkasalubong ang counters ng magkaibang routes
export function checkNamedRateLimit(
  namespace: string,
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const mapKey = `${namespace}:${identifier}`;
  const entry = store.get(mapKey);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + options.windowMs;
    store.set(mapKey, { count: 1, resetAt });
    return { allowed: true, remaining: options.max - 1, resetAt };
  }

  if (entry.count >= options.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(mapKey, entry);
  return { allowed: true, remaining: options.max - entry.count, resetAt: entry.resetAt };
}

// Backward-compatible — panatilihin ito kung sakaling may ibang code na tumatawag pa rito
export function checkRateLimit(identifier: string) {
  return checkNamedRateLimit("generate-trip-ip", identifier, {
    windowMs: 10 * 60 * 1000,
    max: 5,
  });
}

// Cleanup old entries occasionally to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);