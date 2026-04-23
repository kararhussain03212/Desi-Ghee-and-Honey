import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.hash, location.pathname])

  return null
}

export default ScrollToTop

