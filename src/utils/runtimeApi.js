const trimSlash = (value) => String(value || "").replace(/\/+$/, "");

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

function isAbsoluteHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function isSameOriginUrl(value) {
  const origin = getOrigin();
  if (!origin || !isAbsoluteHttpUrl(value)) return false;
  try {
    return new URL(value).origin === origin;
  } catch {
    return false;
  }
}

export function getBackendBaseUrl() {
  const envBase = trimSlash(import.meta.env.VITE_BACKEND_URL);
  if (envBase) {
    if (!isAbsoluteHttpUrl(envBase) || isSameOriginUrl(envBase)) return envBase;
  }
  if (import.meta.env.DEV) return "http://localhost/honey-ghee/backend";

  const origin = getOrigin();
  if (!origin) return "/backend";
  return `${origin}/backend`;
}

export function getPublicApiBaseUrl() {
  const envBase = trimSlash(import.meta.env.VITE_PUBLIC_API_URL);
  if (envBase) {
    if (!isAbsoluteHttpUrl(envBase) || isSameOriginUrl(envBase)) return envBase;
  }
  return `${getBackendBaseUrl()}/api`;
}
