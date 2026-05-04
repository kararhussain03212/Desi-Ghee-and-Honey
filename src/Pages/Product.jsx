import { Link, Navigate } from 'react-router-dom'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { formatRs } from '../utils/money.js'
import { useContent } from '../context/content.js'
import { getSettingText, isSectionActive } from '../utils/siteSettings.js'
import { getBackendBaseUrl } from '../utils/runtimeApi.js'
import '../App.css'

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

function Product() {
  const { products, settings } = useContent()
  const productActive = isSectionActive(settings, 'product', true)

  if (!productActive) {
    return <Navigate to="/" replace />
  }

  const backendBase = getBackendBaseUrl()
  const toAssetUrl = (path, fallback) => {
    if (!path) return fallback
    if (/^https?:\/\//i.test(path)) return path
    const normalizedPath = String(path).replace(/^\//, '').replace(/^backend\//i, '')
    return `${backendBase}/${normalizedPath}`
  }

  const heroImage = toAssetUrl(getSettingText(settings, 'product_page_hero_image', ''), '')
  const heroTitle = getSettingText(settings, "product_page_title", "");
  const breadcrumbHome = getSettingText(
    settings,
    "product_page_breadcrumb_home",
    "",
  );
  const breadcrumbCurrent = getSettingText(
    settings,
    "product_page_breadcrumb_current",
    "",
  );

  const showcaseKicker = getSettingText(
    settings,
    "product_showcase_kicker",
    "",
  );
  const showcaseTitle = getSettingText(settings, "product_showcase_title", "");
  const showcaseText = getSettingText(settings, "product_showcase_text", "");
  const showcaseProducts = products.slice(0, 4);

  const catalogTitle = getSettingText(settings, "product_catalog_title", "");
  const catalogTitleHighlight = getSettingText(
    settings,
    "product_catalog_title_highlight",
    "",
  );
  const catalogDescription = getSettingText(
    settings,
    "product_catalog_description",
    "",
  );

  return (
    <main className="productPage" aria-label="Product page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${heroImage})` }}>
        {/* <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" /> */}

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">{heroTitle}</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              {breadcrumbHome}
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">{breadcrumbCurrent}</span>
          </p>
        </div>
      </section>

      <section className="productShowcase" aria-label="Our product showcase">
        <div className="productShowcase__container">
          <div className="productShowcase__top">
            <div className="productShowcase__left">
              <p className="productShowcase__kicker" data-aos="fade-down" data-aos-duration="1000">
                {showcaseKicker}
              </p>
              <h2 className="productShowcase__title" data-aos="fade-left" data-aos-duration="1000">
                {showcaseTitle}
              </h2>
            </div>
            <div className="productShowcase__right">
              <p className="productShowcase__text" data-aos="fade-right" data-aos-duration="1000">
               {showcaseText}
              </p>
              {/* <a className="productShowcase__btn" href="#shop" aria-label="Shop online">
                Shop Online
              </a> */}
            </div>
          </div>

          <div className="productShowcase__grid" aria-label="Product images">
            {showcaseProducts.map((product, index) => (
              <Link 
                key={product.id}
                className="productShowcaseCard" 
                to={`/product/${product.id}`} 
                aria-label={`Open ${product.title}`} 
                data-aos="flip-left" 
                data-aos-duration={(index + 1) * 1000}
              >
                <img className="productShowcaseCard__img" src={product.image} alt={product.title} loading="lazy" />
                <div className="productShowcaseCard__overlay">
                  <p className="productShowcaseCard__overlayText">{product.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="productsSection" id="shop" aria-label="Fresh honey products">
              <div className="productsInner">
                <h2 className="productsTitle">
                  {catalogTitle} <span>{catalogTitleHighlight}</span>
                </h2>
                <p className="productsDesc">
                  {catalogDescription}
                </p>
      
                <div className="productsGrid">
                  {products.slice(0, 8).map((p) => (
                    <article key={p.id} className="productCard" data-aos="flip-left" data-aos-duration="2000">
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

    </main>
  )
}

export default Product
