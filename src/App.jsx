import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

import NavBar from './Components/NavBar.jsx'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Footer from './Components/Footer.jsx'
import Contact from './Pages/Contact.jsx'
import Product from './Pages/Product.jsx'
import ProductDetails from './Pages/ProductDetails.jsx'
import Order from './Pages/Order.jsx'
import ScrollToTop from './Components/ScrollToTop.jsx'
import Marco from './Components/Marco.jsx'
import FloatingWhatsApp from './Components/FloatingWhatsApp.jsx'
import { useContent } from './context/content.js'
import { isSectionActive } from './utils/siteSettings.js'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { settings } = useContent()
  const navbarActive = isSectionActive(settings, 'navbar', true)
  const footerActive = isSectionActive(settings, 'footer', true)
  const contactActive = isSectionActive(settings, 'contact', true)

  return (
    <div className="app">
      {contactActive ? <FloatingWhatsApp /> : null}
      <ScrollToTop />
      {isHome && navbarActive ? <Marco /> : null}
      {navbarActive ? <NavBar /> : null}
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order" element={<Order />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {footerActive ? <Footer /> : null}
    </div>
  )
}

export default App
