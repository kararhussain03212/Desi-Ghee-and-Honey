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

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app">
      <ScrollToTop />
      {isHome && <Marco />}
      <NavBar />
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
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default App
