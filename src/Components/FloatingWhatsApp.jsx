import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useContent } from '../context/content.js'
import { getSettingText, toWhatsAppDigits } from '../utils/siteSettings.js'


/**
 * Floating WhatsApp Button Component
 * Fixed position button that allows users to contact via WhatsApp
 */
function FloatingWhatsApp() {
  const { settings } = useContent()
  const phoneNumber = toWhatsAppDigits(getSettingText(settings, 'whatsapp_number', '923338399480'))
  const whatsappUrl = `https://wa.me/${phoneNumber}`
  const tooltip = getSettingText(settings, 'whatsapp_tooltip', 'Chat with us!')

  return (
    <a
      href={whatsappUrl}
      className="floatingWhatsApp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <FaWhatsapp className="floatingWhatsApp__icon" />
      <span className="floatingWhatsApp__tooltip">{tooltip}</span>
    </a>
  )
}

export default FloatingWhatsApp
