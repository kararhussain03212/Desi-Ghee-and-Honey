import { useEffect, useMemo, useState } from 'react'
import {FiArrowRight, FiCalendar,FiChevronLeft,FiChevronRight,FiCheck,FiHeart } from 'react-icons/fi'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { Link,  } from 'react-router-dom'
import slider1 from '../assets/Slide image/slider.jpeg'
import gheeslider from '../assets/Slide image/gheeslider.jpeg'
import mockuphoney from '../assets/images/mockuphoney.png'
import aboutImg from '../assets/images/about1.png'
import food from '../assets/icons/food.png'
import apitherapy from '../assets/icons/apitherapy.png'
import honeyicon from '../assets/icons/honey.png'
import cow from '../assets/images/cow.png'
import buffalo from '../assets/images/buffalo.png'
import goat from '../assets/images/goat.png'
import cowicon from '../assets/icons/cowicon.png'
import goaticon from '../assets/icons/goaticon.png'
import buffaloicon from '../assets/icons/buffaloicon.png'
import guee from '../assets/icons/guee.png'
import ghee from '../assets/images/ghee.png'
import lalajan from '../assets/images/lalajan.jpeg'
import saeed from '../assets/images/saeed.jpg'
import team2 from '../assets/images/team2.jpg'
import team3 from '../assets/images/team3.jpg'
import newsletterLeft from '../assets/icons/icon.png'
import newsletterRight from '../assets/icons/honey1.png'
import { products } from '../data/products.js'
import { formatRs } from '../utils/money.js'
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
  const slides = useMemo(
    () => [
      {
        image: slider1,
        title: ['FRESH', 'ORGANIC', 'HONEY'],
      },
      {
        image: gheeslider,
        title: ['PURE', 'NATURAL', 'DESI GHEE'],
      },
    ],
    [],
  )

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
      if (newIndex < 1) {
        return slides.length
      }
      return newIndex
    })
  }

  const next = () => {
    if (slides.length <= 1) return
    setIndex((v) => {
      const newIndex = v + 1
      if (newIndex >= heroSlides.length) {
        return 1
      }
      return newIndex
    })
  }

  const realIndex = slides.length ? ((index - 1 + slides.length) % slides.length) : 0
  const active = slides[realIndex]

 

  const slidesPerView = useSlidesPerView()
  const [logoIndex, setLogoIndex] = useState(0)
  const [logoNoTransition, setLogoNoTransition] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  // const logoSlides = useMemo(() => {
  //   const clones = logos.slice(0, Math.min(slidesPerView, logos.length))
  //   return [...logos, ...clones]
  // }, [logos, slidesPerView])

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setLogoIndex((v) => v + 1), 3000)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  useEffect(() => {
    setLogoNoTransition(true)
    setLogoIndex(0)
    nextFrame(() => setLogoNoTransition(false))
  }, [slidesPerView])

  const clients = useMemo(
    () => [
      {
        avatar: lalajan,
        name: 'Lala Jan',
        role: 'Verified Customer',
        review:
          "This honey is absolutely pure and natural. I've been my family and the taste is incredible. Highly recommended!",
        rating: 5,
      },
      {
        avatar: saeed,
        name: 'Saeed Ali',
        role: 'Verified Customer',
        review:
          "The desi ghee from this company is the best. It's 100% natural and helps with my daily cooking. Worth every rupee!",
        rating: 5,
      },
      {
        avatar: team2,
        name: 'Ayesha Ahmed',
        role: 'Verified Customer',
        review:
          'I love the quality and purity of the products. Great customer service and fast delivery. Definitely ordering again!',
        rating: 5,
      },
      {
        avatar: team3,
        name: 'Fatima Khan',
        role: 'Verified Customer',
        review:
          'The products arrived fresh and pure. Excellent service, quick delivery, and I will order again soon for sure.',
        rating: 5,
      },
    ],
    [],
  )

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
      <section
        className="hero"
        aria-label="Hero slider"
      >
        <div className="hero__slides" aria-hidden="true">
          <div
            className={[
              'hero__track',
              prefersReducedMotion ? 'hero__track--noMotion' : '',
              heroNoTransition ? 'hero__track--noTransition' : '',
            ]
              .filter(Boolean)
              .join(' ')}
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
              <div
                key={`${slide.image}-${i}`}
                className="hero__slide"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
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
              <span className="hero__fresh">{active.title[0]}</span>
              <span className="hero__organic">{active.title[1]}</span>
              <span className="hero__honey">{active.title[2]}</span>
            </h1>

            <Link className="hero__btn" to="/product" data-aos="fade-down" data-aos-duration="1000">
              SHOP NOW
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

     

      <section className="aboutHoneySection" aria-label="About Honey and Desi Ghee">
        <div className="aboutHoneyGrid">
          <div className="aboutHoneyLeft">
            <p className="aboutHoneyKicker" data-aos="fade-down" data-aos-duration="1000">Information</p>
            <h2 className="aboutHoneyTitle" data-aos="fade-right" data-aos-duration="1000">About Honey &amp; <span>Desi Ghee</span> </h2>
            <div className="aboutHoneyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
              <span />
            </div>
            <p className="aboutHoneyText" data-aos="fade-right" data-aos-duration="1000">
              Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared
              using traditional methods to deliver rich aroma, purity, and everyday goodness.
            </p>
            <Link className="aboutHoneyBtn" to="/about" data-aos="fade-up" data-aos-duration="1000">
              Read more
            </Link>
          </div>

          <div className="aboutHoneyMedia">
            {/* <span className="aboutHoneyBadge" aria-label="100% organic product">
              <span className="aboutHoneyBadgeTop">100%</span>
              <span className="aboutHoneyBadgeMid">organic</span>
              <span className="aboutHoneyBadgeBot">product</span>
            </span> */}
            <img className="aboutHoneyImg" src={aboutImg} alt="Honey and desi ghee" loading="lazy"  data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1000" />
          </div>

          <div className="aboutHoneyRight">
            <h3 className="aboutHoneyPropsTitle" data-aos="fade-down" data-aos-duration="1000">
              Useful Properties <span>Of Honey</span> & Desi Ghee
            </h3>
            <ul className="aboutHoneyProps">
              <li className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                <span className="aboutHoneyCheck" aria-hidden="true" >
                  <FiCheck />
                </span>
                <span>
                  <strong>Supports</strong> Healthy Metabolism
                </span>
              </li>
              <li className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                <span className="aboutHoneyCheck" aria-hidden="true">
                  <FiCheck />
                </span>
                <span>
                  <strong>Boosts</strong> Natural Immunity
                </span>
              </li>
              <li className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                <span className="aboutHoneyCheck" aria-hidden="true">
                  <FiCheck />
                </span>
                <span>
                   Improves <strong>Blood</strong> Health
                </span>
              </li>
              <li className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                <span className="aboutHoneyCheck" aria-hidden="true">
                  <FiCheck />
                </span>
                <span>
                  <strong>Promotes </strong>Better Sleep
                </span>
              </li>
              <li className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
                <span className="aboutHoneyCheck" aria-hidden="true">
                  <FiCheck />
                </span>
                <span>
                  <strong>Provides </strong>Natural Energy & Strength 💪
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

       <section className="categorySection" id="about" aria-label="Honey category">
        <div className="categoryGrid">
          <div className="categoryLeft">
            <h2 className="categoryTitle" data-aos="fade-down" data-aos-duration="1000">
              Our Honey Category
            </h2>
            <p className="categoryDesc" data-aos="fade-right" data-aos-duration="1000">
              Explore our premium honey collection, carefully selected to bring you the purest taste of nature. Our honey range includes high-quality, 100% natural varieties that are rich in flavor and packed with essential nutrients.
            </p>
            <div className="categoryMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>

            <div className="categoryList">
              <article className="categoryItem" data-aos="fade-right" data-aos-duration="1000">
                <div className="categoryIcon">
                  <img src={food} alt="" />
                </div>
                <div>
                  <h3 className="categoryItemTitle">Queen Bee Honey</h3>
                  <p className="categoryItemDesc">
                    Queen Bee Honey is a premium-quality natural honey collected from the finest floral sources.
                  </p>
                </div>
              </article>

              <article className="categoryItem" data-aos="fade-right" data-aos-duration="1000">
                <div className="categoryIcon">
                  <img src={apitherapy} alt="" />
                </div>
                <div>
                  <h3 className="categoryItemTitle">Sunflower Honey</h3>
                  <p className="categoryItemDesc">
                    Sunflower Honey is light, golden, and naturally sweet honey made from sunflower blossoms.
                  </p>
                </div>
              </article>

              <article className="categoryItem" data-aos="fade-right" data-aos-duration="1000">
                <div className="categoryIcon">
                  <img src={honeyicon} alt="" />
                </div>
                <div >
                  <h3 className="categoryItemTitle">Manuka Honey</h3>
                  <p className="categoryItemDesc">
                   Manuka Honey is a premium and highly valued honey known for its unique quality and rich taste.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="categoryRight">
            <div className="categoryImages">
              <img className="categoryImg categoryImg--main" src={mockuphoney} alt="Honey"  data-aos="zoom-in-up" data-aos-duration="1000"/>
              {/* <img className="categoryImg categoryImg--sub" src={ghee} alt="Desi ghee" /> */}
            </div>
          </div>
        </div>
      </section>

      <section className="categoryCardsSection" aria-label="Honey cards">
        <div className="categoryCardsGrid">
          <article className="categoryCard" data-aos="fade-right" data-aos-duration="1000">
            <div className="categoryCardIcon">
              <img src={cowicon} alt="" />
            </div>
            <h3 className="categoryCardTitle">Cow Desi Ghee</h3>
            <p className="categoryCardDesc">
            Cow Desi Ghee is made from pure cow milk using traditional methods. Rich in healthy fats, vitamins, and natural nutrients, it supports digestion, boosts energy, and promotes overall health naturally.
            </p>
          </article>

          <article className="categoryCard" data-aos="fade-down" data-aos-duration="1000">
            <div className="categoryCardIcon">
              <img src={goaticon} alt="" />
            </div>
            <h3 className="categoryCardTitle">Goat Desi Ghee</h3>
            <p className="categoryCardDesc">
              Goat Desi Ghee is pure, traditional ghee made from fresh goat milk using natural methods. It has a rich aroma, smooth texture, and authentic taste. This ghee is highly nutritious and rich in healthy fats, vitamins
            </p>
          </article>

          <article className="categoryCard" data-aos="fade-left" data-aos-duration="1000">
            <div className="categoryCardIcon">
              <img src={buffaloicon} alt="" />
            </div>
            <h3 className="categoryCardTitle">Buffalo Desi Ghee</h3>
            <p className="categoryCardDesc">
              Buffalo Desi Ghee is pure, traditional ghee made from high-quality buffalo milk using natural methods. It has a rich aroma, thick texture, and strong authentic flavor. Packed with essential nutrients
            </p>
          </article>
        </div>
      </section>

      <section className="aboutCompanySection" id="company" aria-label="About our company">
        <div className="aboutCompanyGrid">
          <div className="aboutCompanyMedia">
            <div className="aboutCompanyImageWrap">
              <img className="aboutCompanyImage" src={cow} alt="Desi ghee" data-aos="zoom-out-up" data-aos-duration="1000" />
              {/* <button type="button" className="aboutCompanyPlay" aria-label="Play video">
                <FiPlay aria-hidden="true" />
              </button> */}
            </div>
          </div>

          <div className="aboutCompanyContent">
            <p className="aboutCompanyKicker" data-aos="fade-down" data-aos-duration="1000">
              About our Company
            </p>
            <h2 className="aboutCompanyTitle" data-aos="fade-right" data-aos-duration="1000">
            Cow Desi Ghee <span className="aboutCompanyAccent">100% Natural</span> & Traditional Goodness
            </h2>
            <div className="aboutCompanyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>
            <p className="aboutCompanyText" data-aos="fade-right" data-aos-duration="1000">
              Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor. It enhances the taste of your everyday meals like roti, paratha, rice, and various dishes.
            </p>
            <Link className="aboutCompanyBtn" to="/about" data-aos="fade-up" data-aos-duration="1000">
              MORE ABOUT <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="productsSection" id="shop" aria-label="Fresh honey products">
        <div className="productsInner">
          <h2 className="productsTitle" data-aos="fade-down" data-aos-duration="1000">
            Fresh Desi Ghee & <span>Honey</span>
          </h2>
          <p className="productsDesc" data-aos="fade-up" data-aos-duration="1000">
            Experience the purity of our fresh, 100% natural Desi Ghee and Honey.
            Rich in taste and nutrients, perfect for a healthy and delicious lifestyle.
          </p>

          <div className="productsGrid">
            {products.slice(0, 8).map((p) => (
              <article key={p.id} className="productCard"  data-aos="flip-left" data-aos-duration="2000">
                <div className="productMedia">
                  <Link className="productLink" to={`/product/${p.id}`} aria-label={`Open ${p.title}`}>
                    <img className="productImg" src={p.image} alt={p.title} loading="lazy" />
                  </Link>
                  <span className="productBadge" aria-label={p.badge}>
                    {p.badge}
                  </span>
                </div>
                <div className="productBody">
                  <h3 className="productTitle">
                    <Link className="productTitleLink" to={`/product/${p.id}`}>
                      {p.title}
                    </Link>
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

      <section className="offerSection" id="offers" aria-label="Limited offer">
        <div className="offerInner">
          <div className="offerMedia">
            <div className="offerFrame" aria-hidden="true" />
            <img className="offerImage" src={ghee} alt="Ghee" loading="lazy" data-aos="zoom-in" data-aos-duration="1000"/>
          </div>

          <div className="offerContent">
            {/* <p className="offerKicker">Limited Offer For Customer</p> */}
            <h2 className="offerTitle" data-aos="fade-down" data-aos-duration="1000">
              Fresh Cow <span >Orginal Desi Ghee</span>
            </h2>
            <div className="offerMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>
            <p className="offerText" data-aos="fade-right" data-aos-duration="1000">
              Made from fresh and natural ingredients, our Sunflower Original Desi Ghee offers rich taste and premium quality.
              Perfect for everyday cooking, it adds natural flavor and healthy goodness to your meals.
            </p>
            <Link className="offerBtn" to="/product" data-aos="fade-up" data-aos-duration="1000">
              SHOP NOW <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="logoStrip" aria-label="Brand logos">
        <div className="logoStripViewport">
          <div
            className={logoNoTransition ? 'logoStripTrack logoStripTrack--noTransition' : 'logoStripTrack'}
            style={{ transform: `translateX(calc((-100% / ${slidesPerView}) * ${logoIndex}))` }}
            onTransitionEnd={() => {
              if (logoIndex >= logos.length) {
                setLogoNoTransition(true)
                setLogoIndex(0)
                nextFrame(() => setLogoNoTransition(false))
              }
            }}
          >
            {logoSlides.map((logo, i) => (
              <div key={`${logo.src}-${i}`} className="logoStripItem">
                <img className="logoStripImg" src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="blogSection" id="blog" aria-label="News and blog">
        <div className="blogInner">
          <h2 className="blogTitle" data-aos="fade-down" data-aos-duration="1000">
            News And <span>Blog</span>
          </h2>
          <p className="blogDesc" data-aos="fade-right" data-aos-duration="1000">
            Stay updated with the latest news, updates, and insights about our products and natural lifestyle.
          </p>

          <div className="blogGrid" >
            <article className="blogCard" data-aos="flip-left" data-aos-duration="2000">
              <div className="blogMedia">
                <img className="blogImg" src={mockuphoney} alt="Honey comb" loading="lazy" />
              </div>
              <div className="blogBody">
                <div className="blogMeta">
                  <span className="blogMetaItem">
                    <FiCalendar aria-hidden="true" /> 16 April,26
                  </span>
                  <span className="blogMetaItem">
                    <FiHeart aria-hidden="true" /> 35 Million
                  </span>
                </div>
                <h3 className="blogCardTitle">Pure Natural Honey Collected Fresh From Farms With Premium Quality And Taste.</h3>
                <Link className="blogBtn" to="/product">
                  READ MORE <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="blogCard" data-aos="flip-left" data-aos-duration="2000">
              <div className="blogMedia">
                <img className="blogImg" src={buffalo} alt="Honey jar" loading="lazy" />
              </div>
              <div className="blogBody">
                <div className="blogMeta">
                  <span className="blogMetaItem">
                    <FiCalendar aria-hidden="true" /> 16 April,26
                  </span>
                  <span className="blogMetaItem">
                    <FiHeart aria-hidden="true" /> 80 Million
                  </span>
                </div>
                <h3 className="blogCardTitle">Golden Buffalo Desi Ghee Made Traditionally For Rich Taste And Healthy Lifestyle</h3>
                <Link className="blogBtn" to="/product">
                  READ MORE <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="blogCard" data-aos="flip-left" data-aos-duration="2000">
              <div className="blogMedia">
                <img className="blogImg" src={goat} alt="Honey drip" loading="lazy" />
              </div>
              <div className="blogBody">
                <div className="blogMeta">
                  <span className="blogMetaItem">
                    <FiCalendar aria-hidden="true" /> 16 April,26
                  </span>
                  <span className="blogMetaItem">
                    <FiHeart aria-hidden="true" /> 95 Million
                  </span>
                </div>
                <h3 className="blogCardTitle">Fresh Goat Desi Ghee Prepared Naturally For Cooking Nutrition And Daily Use</h3>
                <Link className="blogBtn" to="/product">
                  READ MORE <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section> */}

      <section className="clientsSection" aria-label="Our clients testimonials">
        <div className="clientsInner">
          <h2 className="clientsTitle" data-aos="fade-down" data-aos-duration="1000">
            What Our <span>Clients</span> Say
          </h2>
          <p className="clientsDesc" data-aos="fade-up" data-aos-duration="1000">
            Our customers love our pure honey and desi ghee. Read what they have to say about their experience.
          </p>

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
                        <img src={c.avatar} alt={`${c.name} avatar`} loading="lazy" />
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

      <section className="newsletterSection" aria-label="Newsletter subscription">
        <div className="newsletterCard">
          <div className="newsletterDecor newsletterDecor--left" aria-hidden="true">
            <img src={guee} alt="" loading="lazy" />
          </div>
          <div className="newsletterDecor newsletterDecor--right" aria-hidden="true">
            <img src={newsletterRight} alt="" loading="lazy" />
          </div>

          <div className="newsletterInner">
            <h2 className="newsletterTitle">Subscribe To Our Newsletter</h2>
            <p className="newsletterDesc">Subscribe to our latest newsletter to get news about special discount.</p>

            <form className="newsletterForm" onSubmit={onNewsletterSubmit}>
              <label className="sr-only" htmlFor="newsletterEmail">
                Email
              </label>
              <input
                id="newsletterEmail"
                className="newsletterInput"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value)
                  if (newsletterStatus !== 'idle') setNewsletterStatus('idle')
                }}
              />
              <button className="newsletterBtn" type="submit">
                SUBSCRIBE
              </button>
            </form>

            {newsletterStatus === 'success' ? (
              <p className="newsletterMsg newsletterMsg--success">Thanks! You are subscribed.</p>
            ) : null}
            {newsletterStatus === 'error' ? (
              <p className="newsletterMsg newsletterMsg--error">Please enter a valid email address.</p>
            ) : null}
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home
