import { useEffect, useState } from 'react'
import { FiArrowUp, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { GiHoneyJar } from 'react-icons/gi'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useContent } from '../context/content.js'
import { getSettingJson, getSettingText, isSectionActive } from '../utils/siteSettings.js'
import { getBackendBaseUrl } from '../utils/runtimeApi.js'

function Footer() {
  const [showTop, setShowTop] = useState(false)
  const { settings } = useContent()
  const backendBase = getBackendBaseUrl()
  const toAssetUrl = (path) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    const normalizedPath = String(path).replace(/^\//, '').replace(/^backend\//i, '')
    return `${backendBase}/${normalizedPath}`
  }

  const brandText = getSettingText(settings, "site_brand_text", "");
  const footerLogo = getSettingText(settings, 'footer_logo', '')
  const footerDescription = getSettingText(settings, "footer_description", "");
  const footerContactTitle = getSettingText(
    settings,
    "footer_contact_title",
    "",
  );
  const contactAddress = getSettingText(
    settings,
    'footer_contact_address',
    getSettingText(settings, 'contact_location_text', getSettingText(settings, 'contact_address', 'I-8 Markaz, Islamabad, Pakistan')),
  )
  const contactPhone = getSettingText(
    settings,
    'footer_contact_phone',
    getSettingText(settings, 'contact_phone_text', getSettingText(settings, 'contact_phone', '+92 333 8399480')),
  )
  const contactEmail = getSettingText(
    settings,
    'footer_contact_email',
    getSettingText(settings, 'contact_email_text', getSettingText(settings, 'contact_email', 'info@swiftsigngeneraltrading.com')),
  )
  const footerAccountTitle = getSettingText(
    settings,
    "footer_account_title",
    "",
  );
  const footerNewsletterTitle = getSettingText(
    settings,
    "footer_newsletter_title",
    "",
  );
  const footerNewsletterDescription = getSettingText(
    settings,
    "footer_newsletter_description",
    "",
  );
  const footerCopyright = getSettingText(settings, "footer_copyright", "");
  const footerCreditText = getSettingText(settings, "footer_credit_text", "");
  const footerCreditUrl = getSettingText(settings, "footer_credit_url", "");
  const savedFooterLinks = getSettingJson(settings, "footer_links", []);
  const footerLinkHome = getSettingText(settings, "footer_link_home", "Home");
  const footerLinkAbout = getSettingText(settings, "footer_link_about", "About");
  const footerLinkProduct = getSettingText(settings, "footer_link_product", "Product");
  const footerLinkContact = getSettingText(settings, "footer_link_contact", "Contact");
  const footerLinks = Array.isArray(savedFooterLinks) && savedFooterLinks.length
    ? savedFooterLinks
        .map((item) => ({
          label: String(item?.label || "").trim(),
          path: String(item?.path || "").trim(),
        }))
        .filter((item) => item.label && item.path)
    : [
        { label: footerLinkHome, path: "/" },
        { label: footerLinkAbout, path: "/about" },
        { label: footerLinkProduct, path: "/product" },
        { label: footerLinkContact, path: "/contact" },
      ];

  const filteredFooterLinks = footerLinks.filter((item) => {
    if (item.path === '/about') return isSectionActive(settings, 'about', true)
    if (item.path === '/product') return isSectionActive(settings, 'product', true)
    if (item.path === '/contact') return isSectionActive(settings, 'contact', true)
    return true
  })

  const footerSocials = getSettingJson(settings, "footer_social_links", []);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 260)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="footer" id="contact" aria-label="Footer">
      <div className="footer__top">
        <div className="footer__inner">
          <div className="footer__col">
            <Link className="footer__brand" to="/" aria-label="Home">
              {footerLogo ? (
                <img src={toAssetUrl(footerLogo)} alt={brandText} className="footer__brandIcon" />
              ) : (
                <GiHoneyJar className="footer__brandIcon" aria-hidden="true" />
              )}
              <span className="footer__brandText">{brandText}</span>
            </Link>
            <p className="footer__desc">{footerDescription}</p>
            <div className="footer__social" aria-label="Social links">
              {footerSocials.map((social) => {
                let Icon = FaFacebookF
                if (social.icon === 'tiktok') Icon = FaTiktok
                if (social.icon === 'instagram') Icon = FaInstagram

                return (
                  <a
                    key={`${social.label}-${social.url}`}
                    className="footer__socialBtn"
                    href={social.url || '#'}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">{footerContactTitle}</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <FiMapPin aria-hidden="true" /> {contactAddress}
              </li>
              <li className="footer__item">
                <FiPhone aria-hidden="true" /> {contactPhone}
              </li>
              <li className="footer__item">
                <FiMail aria-hidden="true" /> {contactEmail}
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">{footerAccountTitle}</h3>
            <ul className="footer__links">
              {filteredFooterLinks.map((item) => (
                <li key={`${item.path}-${item.label}`}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">{footerNewsletterTitle}</h3>
            <p className="footer__desc">{footerNewsletterDescription}</p>
            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <label className="footer__field">
                <span className="footer__sr">Email address</span>
                <input className="footer__input" type="email" placeholder="Email Address *" required />
              </label>
              <button className="footer__send" type="submit" aria-label="Subscribe">
                <FiSend aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottomInner">
          {footerCopyright}{' '}
          <a href={footerCreditUrl} target="_blank" rel="noopener noreferrer">
            {footerCreditText}
          </a>
        </div>
      </div>

      <button
        type="button"
        className={showTop ? 'footer__topBtn footer__topBtn--show' : 'footer__topBtn'}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <FiArrowUp aria-hidden="true" />
      </button>
    </footer>
  )
}

export default Footer
