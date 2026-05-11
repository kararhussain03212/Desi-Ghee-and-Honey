import { GiHoneyJar } from 'react-icons/gi'
import { FiShoppingCart } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOrder } from '../context/order.js'
import { useContent } from '../context/content.js'
import { getSettingJson, getSettingText, isSectionActive } from '../utils/siteSettings.js'
import { getBackendBaseUrl } from '../utils/runtimeApi.js'
import "../App.css"



function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { orderCount } = useOrder()
  const { settings } = useContent()
  const backendBase = getBackendBaseUrl()
  const toAssetUrl = (path) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    const normalizedPath = String(path).replace(/^\//, '').replace(/^backend\//i, '')
    return `${backendBase}/${normalizedPath}`
  }

  const brandText = getSettingText(settings, "site_brand_text", "");
  const navLogo = getSettingText(settings, 'nav_logo', '')
  const savedNavLinks = getSettingJson(settings, "nav_links", []);
  const navLinkHome = getSettingText(settings, "nav_link_home", "Home");
  const navLinkAbout = getSettingText(settings, "nav_link_about", "About");
  const navLinkProduct = getSettingText(settings, "nav_link_product", "Product");
  const navLinkContact = getSettingText(settings, "nav_link_contact", "Contact");
  const navLinks = Array.isArray(savedNavLinks) && savedNavLinks.length
    ? savedNavLinks
        .map((item) => ({
          label: String(item?.label || "").trim(),
          path: String(item?.path || "").trim(),
        }))
        .filter((item) => item.label && item.path)
    : [
        { label: navLinkHome, path: "/" },
        { label: navLinkAbout, path: "/about" },
        { label: navLinkProduct, path: "/product" },
        { label: navLinkContact, path: "/contact" },
      ];
  const uniqueNavLinks = navLinks.filter((item, index, arr) => (
    arr.findIndex((candidate) => candidate.path === item.path) === index
  ))
  const filteredNavLinks = uniqueNavLinks.filter((item) => {
    if (item.path === '/about') return isSectionActive(settings, 'about', true)
    if (item.path === '/product') return isSectionActive(settings, 'product', true)
    if (item.path === '/contact') return isSectionActive(settings, 'contact', true)
    return true
  })
  const cartPath = getSettingText(settings, 'nav_cart_path', '/order')
  const cartIcon = getSettingText(settings, 'nav_cart_icon', '')

  useEffect(() => {
    if (!mobileMenuOpen) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [mobileMenuOpen])

  const handleMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
    
    <header className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__brand" to="/" aria-label="Home">
          {navLogo ? (
            <img src={toAssetUrl(navLogo)} alt={brandText} className="navbar__brandIcon" />
          ) : (
            <GiHoneyJar className="navbar__brandIcon" aria-hidden="true" />
          )}
          <span className="navbar__brandText">{brandText}</span>
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          {filteredNavLinks.map((item) => (
            <Link
              key={`${item.path}-${item.label}`}
              className={`navbar__link ${isActive(item.path) ? 'navbar__link--active' : ''}`}
              to={item.path}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link className={`navbar__link navbar__link--shop ${isActive(cartPath) ? 'navbar__link--active' : ''}`} to={cartPath} aria-label="Cart">
            {cartIcon ? (
              <img src={toAssetUrl(cartIcon)} alt="Cart" className="navbar__shopIcon" />
            ) : (
              <FiShoppingCart className="navbar__shopIcon" aria-hidden="true" />
            )}
            {orderCount > 0 && <span className="navbar__badge">{orderCount}</span>}
          </Link>
        </div>

        <button
          className="navbar__mobileToggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="navbar-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="navbar__mobileToggleIcon" aria-hidden="true" />
        </button>
      </div>

      {mobileMenuOpen && <button className="navbar__mobileBackdrop" type="button" aria-label="Close menu" onClick={handleMenuClose} />}

      <nav
        id="navbar-mobile-menu"
        className={mobileMenuOpen ? 'navbar__mobile navbar__mobile--open' : 'navbar__mobile'}
        aria-label="Mobile menu"
      >
        <div className="navbar__mobileHeader">
          <span className="navbar__mobileTitle">Menu</span>
          <button
            className="navbar__mobileClose"
            type="button"
            aria-label="Close menu"
            onClick={handleMenuClose}
          >
            <span className="navbar__mobileCloseIcon" aria-hidden="true" />
          </button>
        </div>
        <div className="navbar__mobileBody">
          {filteredNavLinks.map((item) => (
            <Link
              key={`mobile-${item.path}-${item.label}`}
              className={`navbar__mobileLink ${isActive(item.path) ? 'navbar__mobileLink--active' : ''}`}
              to={item.path}
              onClick={handleMenuClose}
            >
              {item.label}
            </Link>
          ))}
          <Link className={`navbar__mobileLink ${isActive(cartPath) ? 'navbar__mobileLink--active' : ''}`} to={cartPath} onClick={handleMenuClose} aria-label="Cart">
            {cartIcon ? (
              <img src={toAssetUrl(cartIcon)} alt="Cart" className="navbar__shopIcon" />
            ) : (
              <FiShoppingCart className="navbar__shopIcon" aria-hidden="true" />
            )}
            {orderCount > 0 && <span className="navbar__badge">{orderCount}</span>}
          </Link>
        </div>
      </nav>
    </header>

    </>
  )
}

export default NavBar
