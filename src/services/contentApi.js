const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost/honey-ghee/backend/api'
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost/honey-ghee/backend'

function absoluteUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${BACKEND_BASE_URL.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
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
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload?.data
}

export function normalizeProduct(product) {
  const variantsRaw = product?.variants_json
  let variants = []

  if (Array.isArray(variantsRaw)) {
    variants = variantsRaw
  } else if (typeof variantsRaw === 'string' && variantsRaw.trim()) {
    try {
      const parsed = JSON.parse(variantsRaw)
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
    title: String(slide.title || '')
      .split(' ')
      .filter(Boolean),
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
