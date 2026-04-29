import { useEffect, useMemo, useState } from 'react'
import { ContentContext } from './content.js'
import {
  fetchPublicHeroSlides,
  fetchPublicProducts,
  fetchPublicSettings,
  fetchPublicTestimonials,
} from '../services/contentApi.js'

export function ContentProvider({ children }) {
  const [products, setProducts] = useState([])
  const [heroSlides, setHeroSlides] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)

      try {
        const [productsData, heroData, testimonialsData, settingsData] = await Promise.all([
          fetchPublicProducts(),
          fetchPublicHeroSlides(),
          fetchPublicTestimonials(),
          fetchPublicSettings(),
        ])

        if (!isMounted) return

        if (Array.isArray(productsData)) setProducts(productsData)

        if (Array.isArray(heroData)) setHeroSlides(heroData)

        if (Array.isArray(testimonialsData)) setTestimonials(testimonialsData)

        if (settingsData && typeof settingsData === 'object') {
          setSettings(settingsData)
        }
      } catch {
        setProducts([])
        setHeroSlides([])
        setTestimonials([])
        setSettings({})
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    const reloadOnFocus = () => {
      if (document.visibilityState === 'visible') {
        load()
      }
    }
    window.addEventListener('focus', load)
    document.addEventListener('visibilitychange', reloadOnFocus)

    return () => {
      isMounted = false
      window.removeEventListener('focus', load)
      document.removeEventListener('visibilitychange', reloadOnFocus)
    }
  }, [])

  const value = useMemo(
    () => ({ products, heroSlides, testimonials, settings, loading }),
    [products, heroSlides, testimonials, settings, loading],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
