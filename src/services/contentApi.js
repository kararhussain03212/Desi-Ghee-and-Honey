import { getBackendBaseUrl, getPublicApiBaseUrl } from "../utils/runtimeApi.js";

const API_BASE_URL = getPublicApiBaseUrl();
const BACKEND_BASE_URL = getBackendBaseUrl();

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin || "";
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

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getApiCandidates() {
  const envApi = String(import.meta.env.VITE_PUBLIC_API_URL || "").replace(/\/+$/, "");
  const origin = getOrigin();
  const safeEnvApi = !envApi || !isAbsoluteHttpUrl(envApi) || isSameOriginUrl(envApi) ? envApi : "";
  return unique([
    origin ? `${origin}/backend/api` : "",
    origin ? `${origin}/api` : "",
    "http://localhost/honey-ghee/backend/api",
    "http://127.0.0.1/honey-ghee/backend/api",
    safeEnvApi,
    API_BASE_URL,
  ]);
}

function absoluteUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = String(path).replace(/^\//, '').replace(/^backend\//i, '')
  return `${BACKEND_BASE_URL.replace(/\/$/, '')}/${normalizedPath}`
}

function decodeHtmlEntities(value) {
  const text = String(value || '')
  if (!text.includes('&')) return text

  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
}

async function request(path) {
  const candidates = getApiCandidates()
  let lastError = null

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${path}`)
      if (!response.ok) {
        lastError = new Error(`Request failed: ${response.status} (${base}${path})`)
        continue
      }

      const payload = await response.json()
      return payload?.data
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error("Request failed")
}

export function normalizeProduct(product) {
  const variantsRaw = product?.variants_json
  let variants = []

  if (Array.isArray(variantsRaw)) {
    variants = variantsRaw
  } else if (typeof variantsRaw === 'string' && variantsRaw.trim()) {
    try {
      const parsed = JSON.parse(decodeHtmlEntities(variantsRaw))
      if (Array.isArray(parsed)) variants = parsed
    } catch {
      variants = []
    }
  }

  const normalizedVariants = variants
    .map((variant) => ({
      label: String(variant?.label || '').trim(),
      price: Number(variant?.price || 0),
    }))
    .filter((variant) => variant.label)

  return {
    ...product,
    id: String(product.id),
    image: absoluteUrl(product.image_path),
    badge: product.badge || 'New',
    code: product.sku || `SKU-${product.id}`,
    oldPrice: product.old_price === null ? null : Number(product.old_price || 0),
    price: Number(product.price || 0),
    rating: Number(product.rating || 5),
    variants: normalizedVariants,
  }
}

export async function fetchPublicProducts() {
  const data = await request('/public/products')
  if (!Array.isArray(data)) return []
  return data.map(normalizeProduct)
}

export async function fetchPublicHeroSlides() {
  const data = await request('/public/hero')
  if (!Array.isArray(data)) return []

  return data.map((slide) => ({
    id: String(slide.id),
    image: absoluteUrl(slide.image_path),
    title: String(slide.title || ''),
    subtitle: String(slide.subtitle || ''),
    buttonText: slide.button_text || 'Shop Now',
    buttonLink: slide.button_link || '/product',
  }))
}

export async function fetchPublicTestimonials() {
  const data = await request('/public/testimonials')
  if (!Array.isArray(data)) return []

  return data.map((item) => ({
    id: String(item.id),
    avatar: absoluteUrl(item.avatar_path),
    name: decodeHtmlEntities(item.name),
    role: decodeHtmlEntities(item.role || 'Customer'),
    review: decodeHtmlEntities(item.review || ''),
    rating: Number(item.rating || 5),
  }))
}

export async function fetchPublicSettings() {
  const data = await request('/public/settings')
  return data && typeof data === 'object' ? data : {}
}
