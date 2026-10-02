import Cookies from "js-cookie";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Standard fetch wrapper that automatically adds Accept and Authorization headers
 */
export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = false, headers, ...customConfig } = options;

  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  const currentLocale = typeof window !== "undefined" 
    ? (Cookies.get("yuni_locale") || localStorage.getItem("yuni_locale") || "id")
    : "id";

  const config: RequestInit = {
    ...customConfig,
    cache: "no-store", // <-- Mencegah Next.js melakukan caching pada request API ini
    headers: {
      Accept: "application/json",
      "Accept-Language": currentLocale,
      "ngrok-skip-browser-warning": "true", // Bypass halaman peringatan ngrok
      ...headers,
    },
  };

  if (requireAuth) {
    let token = null;
    
    if (typeof window !== "undefined") {
      const rawToken = Cookies.get("auth_token") || localStorage.getItem("auth_token");
      if (rawToken) {
        token = decodeURIComponent(rawToken);
      }
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // Ensure JSON Content-Type if we're sending a body that isn't FormData
  if (
    config.body &&
    !(config.body instanceof FormData) &&
    !Object.keys(config.headers as Record<string, string>).includes(
      "Content-Type"
    )
  ) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Don't auto delete token instantly to avoid deleting valid token during fast navigations
    }

    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || "An error occurred";
    
    if (errorData.errors && typeof errorData.errors === "object") {
      const firstError = Object.values(errorData.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0];
      }
    }
    
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Fetcher for SWR
 */
export const swrFetcher = async (url: string) => {
  // Check if it's an admin endpoint to attach token
  const requireAuth = url.startsWith("/admin");
  const res = await fetchApi(url, { requireAuth });
  return res; 
};
