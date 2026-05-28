const JIKAN_BASE = "https://api.jikan.moe/v4";

let lastRequestTime = 0;
const MIN_INTERVAL = 350;
let requestQueue: (() => void)[] = [];
let isProcessingQueue = false;

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5;

const pendingRequests = new Map<string, Promise<any>>();

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const resolve = requestQueue.shift();
    if (resolve) {
      const now = Date.now();
      const elapsed = now - lastRequestTime;

      if (elapsed < MIN_INTERVAL) {
        await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed));
      }

      lastRequestTime = Date.now();
      resolve();
    }
  }

  isProcessingQueue = false;
}

async function rateLimitedFetch(url: string): Promise<Response> {
  await new Promise<void>((resolve) => {
    requestQueue.push(resolve);
    processQueue();
  });

  return fetch(url);
}

export async function fetchJikan<T = any>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<{ data: T; pagination?: any }> {
  const url = new URL(`${JIKAN_BASE}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const requestPromise = (async () => {
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      const response = await rateLimitedFetch(url.toString());

      if (response.ok) {
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }

      if (response.status === 429) {
        retries--;
        if (retries === 0) {
          throw new Error(`Jikan API rate limit exceeded after retries.`);
        }
        // Wait before retrying (exponential backoff)
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      } else {
        const errorText = await response.text();
        throw new Error(`Jikan API error ${response.status}: ${errorText}`);
      }
    }

    throw new Error("Failed to fetch from Jikan API");
  })();

  pendingRequests.set(cacheKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}
