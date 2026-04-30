import { useEffect, useMemo, useState } from 'react'
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import cowicon from '../assets/icons/cowicon.png'
import goaticon from '../assets/icons/goaticon.png'
import buffaloicon from '../assets/icons/buffaloicon.png'
import guee from '../assets/icons/guee.png'
import newsletterRight from '../assets/icons/honey1.png'
import { formatRs } from '../utils/money.js'
import { useContent } from '../context/content.js'
import { getSettingJson, getSettingText, isSectionActive } from '../utils/siteSettings.js'
import '../App.css'

function useSlidesPerView() {
  const getValue = () => {
    if (typeof window === 'undefined') return 4
    const w = window.innerWidth
    if (w <= 420) return 1
    if (w <= 700) return 2
    if (w <= 1024) return 3
    return 4
  }

  const [value, setValue] = useState(getValue)

  useEffect(() => {
    const onResize = () => setValue(getValue())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return value
}

function nextFrame(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(Boolean(media.matches))
    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  return reduced
}

function getRatingStars(rating) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0))
  const full = Math.floor(safe)
  const hasHalf = safe - full >= 0.5

  return Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return { Icon: FaStar, on: true }
    if (i === full && hasHalf) return { Icon: FaStarHalfAlt, on: true }
    return { Icon: FaRegStar, on: false }
  })
}

function Home() {
  const { products, heroSlides: apiHeroSlides, testimonials: apiTestimonials, settings } = useContent()
  const homeAboutActive = isSectionActive(settings, 'home_about', true)
  const homeCompanyActive = isSectionActive(settings, 'home_company', true)
  const homeOfferActive = isSectionActive(settings, 'home_offer', true)
  const homeTestimonialsActive = isSectionActive(settings, 'home_testimonials', true)
  const homeNewsletterActive = isSectionActive(settings, 'home_newsletter', true)
  const backendBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost/honey-ghee/backend').replace(/\/$/, '')
  const toAssetUrl = (path, fallback) => {
    if (!path) return fallback
    if (/^https?:\/\//i.test(path)) return path
    return `${backendBase}/${String(path).replace(/^\//, '')}`
  }

  const aboutKicker = getSettingText(settings, "home_about_kicker", "");
  const aboutTitle = getSettingText(settings, "home_about_title", "");
  const aboutDescription = getSettingText(
    settings,
    "home_about_description",
    "",
  );
  const aboutButtonText = getSettingText(
    settings,
    "home_about_button_text",
    "",
  );
  const aboutButtonLink = getSettingText(
    settings,
    "home_about_button_link",
    "",
  );
  const aboutImage = toAssetUrl(
    getSettingText(settings, "home_about_image", ""),
    "",
  );
  const aboutPropertiesTitle = getSettingText(
    settings,
    "home_about_properties_title",
    "",
  );
  const aboutProperties = getSettingJson(settings, "home_about_properties", []);

  const gheeCards = getSettingJson(settings, "home_ghee_cards", []);

  const aboutCompanyKicker = getSettingText(
    settings,
    "home_company_kicker",
    "",
  );
  const aboutCompanyTitle = getSettingText(settings, "home_company_title", "");
  const aboutCompanyAccent = getSettingText(
    settings,
    "home_company_accent",
    "",
  );
  const aboutCompanySuffix = getSettingText(
    settings,
    "home_company_suffix",
    "",
  );
  const aboutCompanyText = getSettingText(settings, "home_company_text", "");
  const aboutCompanyImage = toAssetUrl(
    getSettingText(settings, "home_company_image", ""),
    "",
  );
  const aboutCompanyButtonText = getSettingText(
    settings,
    "home_company_button_text",
    "",
  );
  const aboutCompanyButtonLink = getSettingText(
    settings,
    "home_company_button_link",
    "",
  );

  const productsSectionTitle = getSettingText(
    settings,
    "home_products_title",
    "",
  );
  const productsSectionDescription = getSettingText(
    settings,
    "home_products_description",
    "",
  );

  const offerTitle = getSettingText(settings, "home_offer_title", "");
  const offerAccent = getSettingText(settings, "home_offer_accent", "");
  const offerText = getSettingText(settings, "home_offer_description", "");
  const offerButtonText = getSettingText(
    settings,
    "home_offer_button_text",
    "",
  );
  const offerButtonLink = getSettingText(
    settings,
    "home_offer_button_link",
    "",
  );
  const offerImage = toAssetUrl(
    getSettingText(settings, "home_offer_image", ""),
    "",
  );

  const clientsTitle = getSettingText(settings, "home_testimonials_title", "");
  const clientsDescription = getSettingText(
    settings,
    "home_testimonials_description",
    "",
  );

  const newsletterTitle = getSettingText(settings, "home_newsletter_title", "");
  const newsletterDescription = getSettingText(
    settings,
    "home_newsletter_description",
    "",
  );
  const newsletterButtonText = getSettingText(
    settings,
    "home_newsletter_button_text",
    "",
  );
  const newsletterPlaceholder = getSettingText(
    settings,
    "home_newsletter_placeholder",
    "",
  );
  const newsletterSuccessText = getSettingText(
    settings,
    "home_newsletter_success",
    "",
  );
  const newsletterErrorText = getSettingText(
    settings,
    "home_newsletter_error",
    "",
  );

  const slides = useMemo(
    () =>
      (Array.isArray(apiHeroSlides) ? apiHeroSlides : []).map((slide) => ({
        image: slide.image,
        title: String(slide.title || "").trim(),
        subtitle: String(slide.subtitle || "").trim(),
        buttonText: slide.buttonText || "",
        buttonLink: slide.buttonLink || "",
      })),
    [apiHeroSlides],
  );

  const heroSlides = useMemo(() => {
    if (!slides.length) return []
    return [slides[slides.length - 1], ...slides, slides[0]]
  }, [slides])

  const [index, setIndex] = useState(1)
  const [heroNoTransition, setHeroNoTransition] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((v) => v + 1)
    }, 7000)
    return () => clearInterval(id)
  }, [slides.length])

  useEffect(() => {
    if (!prefersReducedMotion) return
    if (index === heroSlides.length - 1) setIndex(1)
    if (index === 0) setIndex(slides.length)
  }, [heroSlides.length, index, prefersReducedMotion, slides.length])

  const prev = () => {
    if (slides.length <= 1) return
    setIndex((v) => {
      const newIndex = v - 1
      if (newIndex < 1) return slides.length
      return newIndex
    })
  }

  const next = () => {
    if (slides.length <= 1) return
    setIndex((v) => {
      const newIndex = v + 1
      if (newIndex >= heroSlides.length) return 1
      return newIndex
    })
  }

  const realIndex = slides.length ? ((index - 1 + slides.length) % slides.length) : 0
  const active = slides[realIndex]
  const heroTitleLines = String(active?.title || '')
    .split(/\r?\n|[|]/)
    .map((line) => line.trim())
    .filter(Boolean)

  const getHeroLineClass = (idx, total) => {
    if (total === 1) return 'hero__honey'
    if (total === 2) return idx === 0 ? 'hero__organic' : 'hero__honey'
    return idx % 3 === 0 ? 'hero__fresh' : idx % 3 === 1 ? 'hero__organic' : 'hero__honey'
  }
  const safeSrc = (value) => {
    const normalized = String(value || '').trim()
    return normalized || undefined
  }

  const slidesPerView = useSlidesPerView()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  const clients = useMemo(() => (Array.isArray(apiTestimonials) ? apiTestimonials : []), [apiTestimonials])

  const onNewsletterSubmit = (e) => {
    e.preventDefault()
    const trimmed = newsletterEmail.trim()

    if (!trimmed || !trimmed.includes('@')) {
      setNewsletterStatus('error')
      return
    }

    setNewsletterStatus('success')
    setNewsletterEmail('')
  }

  const [clientIndex, setClientIndex] = useState(0)
  const [clientNoTransition, setClientNoTransition] = useState(false)

  const clientSlides = useMemo(() => {
    const clones = clients.slice(0, Math.min(slidesPerView, clients.length))
    return [...clients, ...clones]
  }, [clients, slidesPerView])

  useEffect(() => {
    if (prefersReducedMotion || clients.length <= 1) return
    const id = setInterval(() => setClientIndex((v) => v + 1), 5000)
    return () => clearInterval(id)
  }, [clients.length, prefersReducedMotion])

  useEffect(() => {
    setClientNoTransition(true)
    setClientIndex(0)
    nextFrame(() => setClientNoTransition(false))
  }, [slidesPerView])

  return (
    <main className="home" id="home">
      <section className="hero" aria-label="Hero slider">
        <div className="hero__slides" aria-hidden="true">
          <div
            className={[
              'hero__track',
              prefersReducedMotion ? 'hero__track--noMotion' : '',
              heroNoTransition ? 'hero__track--noTransition' : '',
            ].filter(Boolean).join(' ')}
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTransitionEnd={() => {
              if (index === heroSlides.length - 1) {
                setHeroNoTransition(true)
                setIndex(1)
                nextFrame(() => setHeroNoTransition(false))
              }

              if (index === 0) {
                setHeroNoTransition(true)
                setIndex(slides.length)
                nextFrame(() => setHeroNoTransition(false))
              }
            }}
          >
            {heroSlides.map((slide, i) => (
              <div key={`${slide.image}-${i}`} className="hero__slide" style={{ backgroundImage: `url(${slide.image})` }} />
            ))}
          </div>
        </div>

        <div className="hero__overlay">
          <div className="hero__content">
            <h1
              key={realIndex}
              className={prefersReducedMotion ? 'hero__title' : 'hero__title hero__title--animate'}
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              {heroTitleLines.map((line, idx) => (
                <span key={`${line}-${idx}`} className={getHeroLineClass(idx, heroTitleLines.length)}>
                  {line}
                </span>
              ))}
            </h1>
            {active?.subtitle ? (
              <p className="mt-3 max-w-xl text-base text-white/85" data-aos="fade-right" data-aos-duration="1000">
                {active.subtitle}
              </p>
            ) : null}

            <Link className="hero__btn" to={active?.buttonLink || '/product'} data-aos="fade-down" data-aos-duration="1000">
              {active?.buttonText || 'SHOP NOW'}
            </Link>
          </div>

          <button type="button" className="hero__arrow hero__arrow--left" onClick={prev}>
            <FiChevronLeft aria-hidden="true" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button type="button" className="hero__arrow hero__arrow--right" onClick={next}>
            <FiChevronRight aria-hidden="true" />
            <span className="sr-only">Next slide</span>
          </button>

          <div className="hero__dots" role="tablist" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === realIndex ? 'hero__dot hero__dot--active' : 'hero__dot'}
                onClick={() => setIndex(i + 1)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === realIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {homeAboutActive ? (
      <section className="aboutHoneySection" aria-label="About Honey and Desi Ghee">
        <div className="aboutHoneyGrid">
          <div className="aboutHoneyLeft">
            <p className="aboutHoneyKicker" data-aos="fade-down" data-aos-duration="1000">{aboutKicker}</p>
            <h2 className="aboutHoneyTitle" data-aos="fade-right" data-aos-duration="1000">{aboutTitle}</h2>
            <div className="aboutHoneyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
              <span />
            </div>
            <p className="aboutHoneyText" data-aos="fade-right" data-aos-duration="1000">{aboutDescription}</p>
            <Link className="aboutHoneyBtn" to={aboutButtonLink} data-aos="fade-up" data-aos-duration="1000">
              {aboutButtonText}
            </Link>
          </div>

          <div className="aboutHoneyMedia">
            {aboutImage ? (
              <img className="aboutHoneyImg" src={aboutImage} alt="Honey and desi ghee" loading="lazy" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1000" />
            ) : null}
          </div>

          <div className="aboutHoneyRight">
            <h3 className="aboutHoneyPropsTitle" data-aos="fade-down" data-aos-duration="1000">{aboutPropertiesTitle}</h3>
            <ul className="aboutHoneyProps">
              {aboutProperties.map((item, idx) => (
                <li key={`${item}-${idx}`} className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                  <span className="aboutHoneyCheck" aria-hidden="true">
                    <FiCheck />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      ) : null}

      {homeAboutActive ? (
      <section className="categoryCardsSection" aria-label="Honey cards">
        <div className="categoryCardsGrid">
          {gheeCards.map((card, index) => {
            const iconMap = { cow: cowicon, goat: goaticon, buffalo: buffaloicon }
            const iconSrc = card.icon_url ? toAssetUrl(card.icon_url, cowicon) : (iconMap[card.icon] || cowicon)
            const aosByIndex = index % 3 === 0 ? 'fade-right' : index % 3 === 1 ? 'fade-down' : 'fade-left'

            return (
              <article key={`${card.title}-${index}`} className="categoryCard" data-aos={aosByIndex} data-aos-duration="1000">
                <div className="categoryCardIcon">
                  <img src={safeSrc(iconSrc)} alt="" />
                </div>
                <h3 className="categoryCardTitle">{card.title}</h3>
                <p className="categoryCardDesc">{card.description}</p>
              </article>
            )
          })}
        </div>
      </section>
      ) : null}

      {homeCompanyActive ? (
      <section className="aboutCompanySection" id="company" aria-label="About our company">
        <div className="aboutCompanyGrid">
          <div className="aboutCompanyMedia">
            <div className="aboutCompanyImageWrap">
              {aboutCompanyImage ? (
                <img className="aboutCompanyImage" src={aboutCompanyImage} alt="Desi ghee" data-aos="zoom-out-up" data-aos-duration="1000" />
              ) : null}
            </div>
          </div>

          <div className="aboutCompanyContent">
            <p className="aboutCompanyKicker" data-aos="fade-down" data-aos-duration="1000">{aboutCompanyKicker}</p>
            <h2 className="aboutCompanyTitle" data-aos="fade-right" data-aos-duration="1000">
              {aboutCompanyTitle} <span className="aboutCompanyAccent">{aboutCompanyAccent}</span> {aboutCompanySuffix}
            </h2>
            <div className="aboutCompanyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>
            <p className="aboutCompanyText" data-aos="fade-right" data-aos-duration="1000">{aboutCompanyText}</p>
            <Link className="aboutCompanyBtn" to={aboutCompanyButtonLink} data-aos="fade-up" data-aos-duration="1000">
              {aboutCompanyButtonText} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {homeCompanyActive ? (
      <section className="productsSection" id="shop" aria-label="Fresh honey products">
        <div className="productsInner">
          <h2 className="productsTitle" data-aos="fade-down" data-aos-duration="1000">{productsSectionTitle}</h2>
          <p className="productsDesc" data-aos="fade-up" data-aos-duration="1000">{productsSectionDescription}</p>

          <div className="productsGrid">
            {products.slice(0, 8).map((p) => (
              <article key={p.id} className="productCard" data-aos="flip-left" data-aos-duration="2000">
                <div className="productMedia">
                  <Link className="productLink" to={`/product/${p.id}`} aria-label={`Open ${p.title}`}>
                    <img className="productImg" src={safeSrc(p.image)} alt={p.title} loading="lazy" />
                  </Link>
                  <span className="productBadge" aria-label={p.badge}>{p.badge}</span>
                </div>
                <div className="productBody">
                  <h3 className="productTitle">
                    <Link className="productTitleLink" to={`/product/${p.id}`}>{p.title}</Link>
                  </h3>
                  <div className="productMeta">
                    <div className={p.variants?.length ? 'productPrice productPrice--multi' : 'productPrice'}>
                      {p.variants?.length ? (
                        p.variants.map((v, idx) => (
                          <span key={v.label} className={idx === 0 ? 'productPriceNow' : 'productPriceSub'}>
                            {v.label}: {formatRs(v.price)}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="productPriceNow">{formatRs(p.price)}</span>
                          {Number.isFinite(Number(p.oldPrice)) && Number(p.oldPrice) > Number(p.price) ? (
                            <span className="productPriceOld">{formatRs(p.oldPrice)}</span>
                          ) : null}
                        </>
                      )}
                    </div>
                    <div className="productRating" aria-label={`${p.rating} out of 5 stars`}>
                      {getRatingStars(p.rating).map(({ Icon, on }, i) => (
                        <Icon key={i} className={on ? 'productStar productStar--on' : 'productStar'} aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {homeOfferActive ? (
      <section className="offerSection" id="offers" aria-label="Limited offer">
        <div className="offerInner">
          <div className="offerMedia">
            <div className="offerFrame" aria-hidden="true" />
            {offerImage ? (
              <img className="offerImage" src={offerImage} alt="Ghee" loading="lazy" data-aos="zoom-in" data-aos-duration="1000" />
            ) : null}
          </div>

          <div className="offerContent">
            <h2 className="offerTitle" data-aos="fade-down" data-aos-duration="1000">
              {offerTitle} <span>{offerAccent}</span>
            </h2>
            <div className="offerMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>
            <p className="offerText" data-aos="fade-right" data-aos-duration="1000">{offerText}</p>
            <Link className="offerBtn" to={offerButtonLink} data-aos="fade-up" data-aos-duration="1000">
              {offerButtonText} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {homeTestimonialsActive ? (
      <section className="clientsSection" aria-label="Our clients testimonials">
        <div className="clientsInner">
          <h2 className="clientsTitle" data-aos="fade-down" data-aos-duration="1000">{clientsTitle}</h2>
          <p className="clientsDesc" data-aos="fade-up" data-aos-duration="1000">{clientsDescription}</p>

          <div className="clientsCarouselViewport" style={{ '--spv': slidesPerView }}>
            <div
              className={clientNoTransition ? 'clientsCarouselTrack clientsCarouselTrack--noTransition' : 'clientsCarouselTrack'}
              style={{ transform: `translateX(calc((-100% / ${slidesPerView}) * ${clientIndex}))` }}
              onTransitionEnd={() => {
                if (clientIndex >= clients.length) {
                  setClientNoTransition(true)
                  setClientIndex(0)
                  nextFrame(() => setClientNoTransition(false))
                }
              }}
            >
              {clientSlides.map((c, i) => (
                <div key={`${c.name}-${i}`} className="clientsCarouselItem">
                  <article className="clientCard">
                    <div className="clientInfo">
                      <div className="clientAvatar">
                        <img src={safeSrc(c.avatar)} alt={`${c.name} avatar`} loading="lazy" />
                      </div>
                      <div>
                        <h4 className="clientName">{c.name}</h4>
                        <p className="clientRole">{c.role}</p>
                      </div>
                    </div>

                    <p className="clientReview">"{c.review}"</p>

                    <div className="clientRating" aria-label={`${c.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className={starIndex < c.rating ? 'clientStar clientStar--on' : 'clientStar'}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {homeNewsletterActive ? (
      <section className="newsletterSection" aria-label="Newsletter subscription">
        <div className="newsletterCard">
          <div className="newsletterDecor newsletterDecor--left" aria-hidden="true">
            <img src={guee} alt="" loading="lazy" />
          </div>
          <div className="newsletterDecor newsletterDecor--right" aria-hidden="true">
            <img src={newsletterRight} alt="" loading="lazy" />
          </div>

          <div className="newsletterInner">
            <h2 className="newsletterTitle">{newsletterTitle}</h2>
            <p className="newsletterDesc">{newsletterDescription}</p>

            <form className="newsletterForm" onSubmit={onNewsletterSubmit}>
              <label className="sr-only" htmlFor="newsletterEmail">Email</label>
              <input
                id="newsletterEmail"
                className="newsletterInput"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={newsletterPlaceholder}
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value)
                  if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                }}
              />
              <button className="newsletterBtn" type="submit">{newsletterButtonText}</button>
            </form>

            {newsletterStatus === 'success' ? (
              <p className="newsletterMsg newsletterMsg--success">{newsletterSuccessText}</p>
            ) : null}
            {newsletterStatus === 'error' ? (
              <p className="newsletterMsg newsletterMsg--error">{newsletterErrorText}</p>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}
    </main>
  )
}

export default Home
