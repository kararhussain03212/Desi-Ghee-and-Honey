function decodeHtmlEntities(value) {
  const text = String(value ?? '')
  if (!text.includes('&')) return text

  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
}

export function getSettingText(settings, key, fallback = '') {
  const raw = settings && Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : null
  if (raw === null || raw === undefined || raw === '') return fallback
  return decodeHtmlEntities(raw)
}

export function getSettingJson(settings, key, fallback = null) {
  const raw = getSettingText(settings, key, '')
  if (!raw) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function toWhatsAppDigits(input, fallback = '923338399480') {
  const digits = String(input || '').replace(/[^\d]/g, '')
  return digits || fallback
}

export function isSectionActive(settings, sectionKey, fallback = true) {
  const key = `section_status_${sectionKey}`
  const status = getSettingText(settings, key, fallback ? 'active' : 'inactive')
  const normalized = String(status).trim().toLowerCase()
  return normalized !== 'inactive' && normalized !== 'unactive'
}
