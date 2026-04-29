import { GiHoneyJar } from 'react-icons/gi'
import { FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOrder } from '../context/order.js'
import { useContent } from '../context/content.js'
import { getSettingJson, getSettingText, isSectionActive } from '../utils/siteSettings.js'
import "../App.css"



function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { orderCount } = useOrder()
  const { settings } = useContent()
  const backendBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost/honey-ghee/backend').replace(/\/$/, '')
  const toAssetUrl = (path) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    return `${backendBase}/${String(path).replace(/^\//, '')}`
  }

  const brandText = getSettingText(settings, 'site_brand_text', 'Swift Sign')
  const navLogo = getSettingText(settings, 'nav_logo', '')
  const navLinks = getSettingJson(settings, 'nav_links', [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Product', path: '/product' },
    { label: 'Contact', path: '/contact' },
  ])
  const filteredNavLinks = navLinks.filter((item) => {
    if (item.path === '/about') return isSectionActive(settings, 'about', true)
    if (item.path === '/product') return isSectionActive(settings, 'product', true)
    if (item.path === '/contact') return isSectionActive(settings, 'contact', true)
    return true
  })
  const cartPath = getSettingText(settings, 'nav_cart_path', '/order')
  const cartIcon = getSettingText(settings, 'nav_cart_icon', '')

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
          <Link className={`navbar__link navbar__link--shop ${isActive(cartPath) ? 'navbar__link--active' : ''}`} to={cartPath} aria-label="Cart">
            {cartIcon ? (
              <img src={toAssetUrl(cartIcon)} alt="Cart" className="navbar__shopIcon" />
            ) : (
              <FiShoppingCart className="navbar__shopIcon" aria-hidden="true" />
            )}
            {orderCount > 0 && <span className="navbar__badge">{orderCount}</span>}
          </Link>
        </nav>

        <button
          className="navbar__mobileToggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="navbar__mobileToggleIcon" aria-hidden="true" />
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="navbar__mobile" aria-label="Mobile menu">
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
        </nav>
      )}
    </header>

    </>
  )
}

export default NavBar
