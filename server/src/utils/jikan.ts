const JIKAN_BASE = "https://api.jikan.moe/v4";

let lastRequestTime = 0;
const MIN_INTERVAL = 350;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < MIN_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL - elapsed));
  }

  lastRequestTime = Date.now();
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

  const response = await rateLimitedFetch(url.toString());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jikan API error ${response.status}: ${errorText}`);
  }

  return response.json();
}
