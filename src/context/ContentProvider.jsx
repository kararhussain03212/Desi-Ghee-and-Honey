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
        const [productsRes, heroRes, testimonialsRes, settingsRes] = await Promise.allSettled([
          fetchPublicProducts(),
          fetchPublicHeroSlides(),
          fetchPublicTestimonials(),
          fetchPublicSettings(),
        ])

        if (!isMounted) return

        setProducts(productsRes.status === 'fulfilled' && Array.isArray(productsRes.value) ? productsRes.value : [])
        setHeroSlides(heroRes.status === 'fulfilled' && Array.isArray(heroRes.value) ? heroRes.value : [])
        setTestimonials(
          testimonialsRes.status === 'fulfilled' && Array.isArray(testimonialsRes.value) ? testimonialsRes.value : []
        )
        setSettings(settingsRes.status === 'fulfilled' && settingsRes.value && typeof settingsRes.value === 'object' ? settingsRes.value : {})
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
