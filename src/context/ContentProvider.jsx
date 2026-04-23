import { useEffect, useMemo, useState } from 'react'
import { ContentContext } from './content.js'
import { products as fallbackProducts } from '../data/products.js'
import {
  fetchPublicHeroSlides,
  fetchPublicProducts,
  fetchPublicSettings,
  fetchPublicTestimonials,
} from '../services/contentApi.js'

export function ContentProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts)
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

        if (Array.isArray(productsData) && productsData.length) {
          setProducts(productsData)
        }

        if (Array.isArray(heroData) && heroData.length) {
          setHeroSlides(heroData)
        }

        if (Array.isArray(testimonialsData) && testimonialsData.length) {
          setTestimonials(testimonialsData)
        }

        if (settingsData && typeof settingsData === 'object') {
          setSettings(settingsData)
        }
      } catch {
        // Keep fallback content if API is unavailable.
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({ products, heroSlides, testimonials, settings, loading }),
    [products, heroSlides, testimonials, settings, loading],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
