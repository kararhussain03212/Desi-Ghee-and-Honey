import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'


/**
 * Floating WhatsApp Button Component
 * Fixed position button that allows users to contact via WhatsApp
 */
function FloatingWhatsApp() {
  const phoneNumber = '+923338399480' // WhatsApp number without formatting
  const whatsappUrl = `https://wa.me/${phoneNumber}`

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
      <span className="floatingWhatsApp__tooltip">Chat with us!</span>
    </a>
  )
}

export default FloatingWhatsApp
