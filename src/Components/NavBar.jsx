import { GiHoneyJar } from 'react-icons/gi'
import { FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOrder } from '../context/order.js'
import "../App.css"



function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { orderCount } = useOrder()

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
          <GiHoneyJar className="navbar__brandIcon" aria-hidden="true" />
          <span className="navbar__brandText">Swift Sign</span>
        </Link>

        <nav className="navbar__nav" aria-label="Primary">
          <Link className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`} to="/">
            Home
          </Link>
          <Link className={`navbar__link ${isActive('/about') ? 'navbar__link--active' : ''}`} to="/about">
            About
          </Link>
          <Link className={`navbar__link ${isActive('/product') ? 'navbar__link--active' : ''}`} to="/product">
            Product
          </Link>
          <Link className={`navbar__link ${isActive('/contact') ? 'navbar__link--active' : ''}`} to="/contact">
            Contact
          </Link>
          <Link className={`navbar__link navbar__link--shop ${isActive('/order') ? 'navbar__link--active' : ''}`} to="/order" aria-label="Shop Cart">
            <FiShoppingCart className="navbar__shopIcon" aria-hidden="true" />
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
          <Link className={`navbar__mobileLink ${isActive('/') ? 'navbar__mobileLink--active' : ''}`} to="/" onClick={handleMenuClose}>
            Home
          </Link>
          <Link className={`navbar__mobileLink ${isActive('/about') ? 'navbar__mobileLink--active' : ''}`} to="/about" onClick={handleMenuClose}>
            About
          </Link>
          <Link className={`navbar__mobileLink ${isActive('/product') ? 'navbar__mobileLink--active' : ''}`} to="/product" onClick={handleMenuClose}>
            Product
          </Link>
          <Link className={`navbar__mobileLink ${isActive('/contact') ? 'navbar__mobileLink--active' : ''}`} to="/contact" onClick={handleMenuClose}>
            Contact
          </Link>
          <Link className={`navbar__mobileLink ${isActive('/order') ? 'navbar__mobileLink--active' : ''}`} to="/order" onClick={handleMenuClose} aria-label="Shop Cart">
            <FiShoppingCart className="navbar__shopIcon" aria-hidden="true" />
            {orderCount > 0 && <span className="navbar__badge">{orderCount}</span>}
          </Link>
        </nav>
      )}
    </header>

    </>
  )
}

export default NavBar
