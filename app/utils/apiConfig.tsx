// utils/apiConfig.js

// Prefer NEXT_PUBLIC_API_BASE_URL if available,
// otherwise fall back to a relative path (safe for Next.js build)
const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "";

// Helper to safely join URLs (avoids double slashes)
function joinUrl(base: any, path: any) {
  if (!base) return path; // relative fallback
  return `${base.replace(/\/+$/, "")}${path}`;
}

const API_URLS = {
  // Auth APIs
  LoginAPI: joinUrl(BASE, "/auth/login"),
  RegisterAPI: joinUrl(BASE, "/auth/register"),

  // Parts API
  PartsAPI: joinUrl(BASE, "/parts"),
};

export default API_URLS;
