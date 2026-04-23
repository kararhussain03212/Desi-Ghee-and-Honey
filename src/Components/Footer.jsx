import { useEffect, useState } from 'react'
import { FiArrowUp, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { GiHoneyJar } from 'react-icons/gi'
import { FaFacebookF, FaGooglePlusG, FaInstagram, FaTiktok } from 'react-icons/fa'

import { Link } from 'react-router-dom'

function Footer() {
  const [showTop, setShowTop] = useState(false)

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
            <Link className="footer__brand" to="/" aria-label="Annahl Home">
              <GiHoneyJar className="footer__brandIcon" aria-hidden="true" />
              <span className="footer__brandText">Swift Sign</span>
            </Link>
            <p className="footer__desc">
              SwiftSign General Trading includes a broad range of activities, defined by expertise and industry practices
            </p>
            <div className="footer__social" aria-label="Social links">
              <a className="footer__socialBtn" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" />
              </a>
              <a className="footer__socialBtn"  aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <FaTiktok aria-hidden="true" />
              </a>
              <a className="footer__socialBtn"  aria-label="Instagram">
                <FaInstagram aria-hidden="true" />
              </a>
              {/* <a className="footer__socialBtn" href="#google" aria-label="Google Plus">
                <FaGooglePlusG aria-hidden="true" />
              </a> */}
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">CONTACT</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <FiMapPin aria-hidden="true" /> I-8 Markaz, Islamabad, Pakistan
              </li>
              <li className="footer__item">
                <FiPhone aria-hidden="true" /> +92 333 8399480
              </li>
              <li className="footer__item">
                <FiMail aria-hidden="true" /> info@swiftsigngeneraltrading.com
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">MY ACCOUNT</h3>
            <ul className="footer__links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/product">Product</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">NEW SLETTER</h3>
            <p className="footer__desc">
              You will be notified when SwiftSign General Trading shares something new
            </p>
            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <label className="footer__field">
                <span className="footer__sr">Email address</span>
                <input
                  className="footer__input"
                  type="email"
                  placeholder="Email Address *"
                  required
                />
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
          Copyright © 2026 All Rights Reserved. 
          <a href="https://it.swiftsignbm.com/" target="_blank" rel="noopener noreferrer">
             Swift IT
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
