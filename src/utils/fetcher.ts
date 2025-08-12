import { CONFIG } from "../config";

export interface FetchOptions {
  path: string; // must begin with '/'
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number; // network retry attempts (not for HTTP status errors)
  retryDelayMs?: number; // base delay
  throwOnNetworkError?: boolean; // if false, return a typed network error object instead of throwing
}

export class HttpError extends Error {
  status: number;
  url: string;
  constructor(url: string, status: number, message: string) {
    super(message || `HTTP ${status}`);
    this.status = status;
    this.url = url;
  }
}

// Allow dynamic override of base URL (e.g. if dev server auto-shifted port)
let dynamicBaseUrl: string | null = null;
let configuredBase = CONFIG.BFF_URL; // track env changes during HMR

async function tryFetch<T>(
  fullUrl: string,
  fetchInit: RequestInit,
  expectJson: boolean
): Promise<T> {
  const res = await fetch(fullUrl, fetchInit);
  if (!res.ok) {
    let msg = "";
    try {
      msg = await res.text();
    } catch {
      /* ignore */
    }
    throw new HttpError(res.url, res.status, msg || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return expectJson ? ((await res.json()) as T) : (undefined as T);
}

export async function apiFetch<T = unknown>(options: FetchOptions): Promise<T> {
  const {
    path,
    method = "GET",
    body,
    headers = {},
    timeoutMs = CONFIG.FETCH_TIMEOUT_MS,
    retries = 0,
    retryDelayMs = 300,
    throwOnNetworkError = true,
  } = options;
  // Reset dynamic base if env changed (HMR / .env.local update)
  if (CONFIG.BFF_URL !== configuredBase) {
    dynamicBaseUrl = null;
    configuredBase = CONFIG.BFF_URL;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const token = localStorage.getItem("auth_token");
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (token && !finalHeaders.Authorization)
    finalHeaders.Authorization = `Bearer ${token}`;

  const fetchInit: RequestInit = {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  };

  const expectJson = true; // current usage always expects JSON

  // Primary attempt
  let lastErr: unknown;
  const tried: string[] = [];
  const baseToTry: string[] = [];
  const initialBase = dynamicBaseUrl || CONFIG.BFF_URL;
  baseToTry.push(initialBase);

  // If localhost and port is 4000, add fallback sequential ports (dev convenience)
  try {
    const urlObj = new URL(initialBase);
    if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
      const port = parseInt(urlObj.port || "4000", 10);
      if (port === 4000) {
        for (let p = 4001; p <= 4005; p++)
          baseToTry.push(`${urlObj.protocol}//${urlObj.hostname}:${p}`);
      }
    }
  } catch {
    // ignore URL parse issues
  }

  let attempt = 0;
  let networkFailed = false;
  while (attempt <= retries) {
    for (const base of baseToTry) {
      const fullUrl = `${base}${path}`;
      tried.push(fullUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (
        import.meta &&
        (import.meta as any).env &&
        (import.meta as any).env.DEV &&
        attempt === 0 &&
        tried.length === 1
      ) {
        console.debug("[apiFetch] attempt 0 ->", fullUrl);
      }
      try {
        const result = await tryFetch<T>(fullUrl, fetchInit, expectJson);
        if (!dynamicBaseUrl && base !== initialBase) dynamicBaseUrl = base;
        clearTimeout(timeout);
        return result;
      } catch (err) {
        // Duck-type detection of HttpError (status number) to avoid cross-realm instanceof issues in tests
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (
          err &&
          typeof err === "object" &&
          "status" in err &&
          typeof (err as any).status === "number"
        ) {
          clearTimeout(timeout);
          throw err; // HTTP status -> no retries beyond base switching
        }
        lastErr = err;
        networkFailed = true;
        // try next base, then maybe retry loop
      }
    }
    if (networkFailed && attempt < retries) {
      const delay = retryDelayMs * Math.pow(2, attempt); // exponential backoff
      await new Promise((r) => setTimeout(r, delay));
    }
    attempt++;
  }

  clearTimeout(timeout);
  if (lastErr instanceof HttpError) throw lastErr;
  const lastMsg =
    lastErr && typeof lastErr === "object" && "message" in lastErr
      ? (lastErr as Error).message
      : String(lastErr);
  const networkMsg = `Network fetch failed for ${path}. Tried: ${tried.join(
    ", "
  )}. Attempts=${attempt}. Last error: ${lastMsg}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
    console.warn("[apiFetch] network failure", {
      path,
      tried,
      attempts: attempt,
      lastErr,
    });
    // expose for quick manual inspection
    // @ts-expect-error debug export
    window.__lastApiFetchDebug = { path, tried, attempts: attempt, lastErr };
  }
  if (throwOnNetworkError) throw new TypeError(networkMsg);
  return { networkError: true, message: networkMsg } as unknown as T;
}

// Convenience helper to create an abortable request without exposing controller outside
export function abortableFetch<T = unknown>(options: FetchOptions) {
  const controller = new AbortController();
  const promise = apiFetch<T>({
    ...options, // pass through
  });
  return { promise, abort: () => controller.abort() };
}
