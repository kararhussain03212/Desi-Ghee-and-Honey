import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { useState } from 'react'
import about1 from '../assets/banner/about1.jpeg'
import { useContent } from '../context/content.js'
import { getSettingText, toWhatsAppDigits } from '../utils/siteSettings.js'



function Contact() {
  const { settings } = useContent()
  const backendBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost/honey-ghee/backend').replace(/\/$/, '')
  const toAssetUrl = (path, fallback) => {
    if (!path) return fallback
    if (/^https?:\/\//i.test(path)) return path
    return `${backendBase}/${String(path).replace(/^\//, '')}`
  }

  const heroImage = toAssetUrl(getSettingText(settings, 'contact_page_hero_image', ''), about1)
  const pageTitle = getSettingText(settings, 'contact_page_title', 'Contact')
  const breadcrumbHome = getSettingText(settings, 'contact_page_breadcrumb_home', 'Home')
  const breadcrumbCurrent = getSettingText(settings, 'contact_page_breadcrumb_current', 'Contact')

  const sectionTitle = getSettingText(settings, 'contact_section_title', 'Our Contacts')
  const sectionDescription = getSettingText(
    settings,
    'contact_section_description',
    'Swift Sign Trading offers premium Desi Ghee and Natural Honey made from 100% natural ingredients. We ensure quality, freshness, and authentic taste in every product.',
  )
  const locationTitle = getSettingText(settings, 'contact_location_title', 'Our Location')
  const locationText = getSettingText(settings, 'contact_location_text', 'I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan')
  const phoneTitle = getSettingText(settings, 'contact_phone_title', 'Phone')
  const phoneText = getSettingText(settings, 'contact_phone_text', getSettingText(settings, 'contact_phone', '+92 333 8399480'))
  const emailTitle = getSettingText(settings, 'contact_email_title', 'Email')
  const emailText = getSettingText(settings, 'contact_email_text', getSettingText(settings, 'contact_email', 'info@swiftsigngeneraltrading.com'))

  const formTitle = getSettingText(settings, 'contact_form_title', 'Quick Contact Form')
  const formNamePlaceholder = getSettingText(settings, 'contact_form_name_placeholder', 'Name')
  const formLastnamePlaceholder = getSettingText(settings, 'contact_form_lastname_placeholder', 'Lastname')
  const formEmailPlaceholder = getSettingText(settings, 'contact_form_email_placeholder', 'Email')
  const formSubjectPlaceholder = getSettingText(settings, 'contact_form_subject_placeholder', 'Subject')
  const formMessagePlaceholder = getSettingText(settings, 'contact_form_message_placeholder', 'Message')
  const formButtonText = getSettingText(settings, 'contact_form_button_text', 'SEND MESSAGE')
  const whatsappPrefix = getSettingText(settings, 'contact_form_whatsapp_prefix', 'Contact Form Submission')

  const mapTitle = getSettingText(settings, 'contact_map_title', 'Map')
  const mapEmbedUrl = getSettingText(
    settings,
    'contact_map_embed_url',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.8!2d73.0759443!3d33.6711939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95459918a25f:0x46495cfc8ce0a1a3!2sI-8%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2spk!4v1713177600000',
  )
  const whatsappNumber = toWhatsAppDigits(getSettingText(settings, 'whatsapp_number', '923338399480'))

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const whatsappMessage = `${whatsappPrefix}\n\nName: ${formData.name} ${formData.lastname}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    // Reset form after sending
    setFormData({
      name: '',
      lastname: '',
      email: '',
      subject: '',
      message: '',
    })
  }
  return (
    <main className="contactPage" aria-label="contact page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${heroImage})` }}>
        {/* <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" /> */}

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">{pageTitle}</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              {breadcrumbHome}
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">{breadcrumbCurrent}</span>
          </p>
        </div>
      </section>

      <section className="contactSection" aria-label="Contact content">
        <div className="contactGrid">
          <div className="contactLeft">
            <h2 className="contactTitle">{sectionTitle}</h2>
            <p className="contactDesc">{sectionDescription}</p>

            <div className="contactCards">
              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiMapPin />
                </div>
                <div>
                  <h3 className="contactCardTitle">{locationTitle}</h3>
                  <p className="contactCardText">{locationText}</p>
                </div>
              </article>

              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="contactCardTitle">{phoneTitle}</h3>
                  <p className="contactCardText">{phoneText}</p>
                </div>
              </article>

              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiMail />
                </div>
                <div>
                  <h3 className="contactCardTitle">{emailTitle}</h3>
                  <p className="contactCardText">{emailText}</p>
                </div>
              </article>
            </div>
          </div>

          <div className="contactRight" aria-label="Quick contact form">
            <h2 className="contactTitle">{formTitle}</h2>
            <form className="contactForm" onSubmit={handleSubmit}>
              <div className="contactFormGrid">
                <label className="contactField">
                  <span className="contactSr">Name</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="name"
                    placeholder={formNamePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Lastname</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="lastname"
                    placeholder={formLastnamePlaceholder}
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Email</span>
                  <input
                    className="contactInput"
                    type="email"
                    name="email"
                    placeholder={formEmailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Subject</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="subject"
                    placeholder={formSubjectPlaceholder}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="contactField contactField--full">
                <span className="contactSr">Message</span>
                <textarea
                  className="contactTextarea"
                  name="message"
                  placeholder={formMessagePlaceholder}
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>

              <button className="contactBtn" type="submit">
                {formButtonText}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mapSection" aria-label="Map">
        <div className="mapInner">
          <iframe
            className="mapFrame"
            title={mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            src={mapEmbedUrl}
          />
        </div>
      </section>
    </main>
  )
}

export default Contact
