import { Link } from 'react-router-dom'
import about1 from '../assets/banner/about1.jpeg'
import honey2 from '../assets/images/honey2.jpg'
import cow from '../assets/images/cow.png'
import buffalo from '../assets/images/buffalo.png'
import mockuphoney from '../assets/images/mockuphoney.png'
import goat from '../assets/images/goat.png'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi'
import { products } from '../data/products.js'
import { formatRs } from '../utils/money.js'
import '../App.css'

const showcaseProducts = [
  {
    id: 'Raw-honey',
    title: 'Pure Honey',
    image: mockuphoney,
    duration: 1000
  },
  {
    id: 'Goat-Desi-Ghee',
    title: 'Goat Desi Ghee',
    image: goat,
    duration: 2000
  },
  {
    id: 'wildflower-honey',
    title: 'Buffalo Ghee',
    image: buffalo,
    duration: 3000
  },
  {
    id: 'queen-bee-honey',
    title: 'Cow Desi Ghee',
    image: cow,
    duration: 4000
  }
]

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
  return (
    <main className="productPage" aria-label="Product page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${about1})` }}>
        {/* <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" /> */}

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">Product</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              Home
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">Product</span>
          </p>
        </div>
      </section>

      <section className="productShowcase" aria-label="Our product showcase">
        <div className="productShowcase__container">
          <div className="productShowcase__top">
            <div className="productShowcase__left">
              <p className="productShowcase__kicker" data-aos="fade-down" data-aos-duration="1000">
                OUR PRODUCT
              </p>
              <h2 className="productShowcase__title" data-aos="fade-left" data-aos-duration="1000">
                TRY OUT A DIFFERENT HONEY & GHEE TASTE THIS TIME
              </h2>
            </div>
            <div className="productShowcase__right">
              <p className="productShowcase__text" data-aos="fade-right" data-aos-duration="1000">
               SwiftSign General Trading offers a diverse range of premium honey and desi ghee products, carefully sourced and crafted to deliver exceptional taste and quality. With a strong focus on expertise and industry standards, we ensure natural freshness, rich flavor, and reliable quality in every product, giving customers a unique and satisfying experience every time
              </p>
              {/* <a className="productShowcase__btn" href="#shop" aria-label="Shop online">
                Shop Online
              </a> */}
            </div>
          </div>

          <div className="productShowcase__grid" aria-label="Product images">
            {showcaseProducts.map((product) => (
              <Link 
                key={product.id}
                className="productShowcaseCard" 
                to={`/product/${product.id}`} 
                aria-label={`Open ${product.title}`} 
                data-aos="flip-left" 
                data-aos-duration={product.duration}
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
                  Fresh Desi Ghee & <span>Honey</span>
                </h2>
                <p className="productsDesc">
                  Made from fresh and natural ingredients, our Sunflower Original Desi Ghee offers rich taste and premium quality.
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


        {/* <section className="blogSection" id="blog" aria-label="News and blog">
                <div className="blogInner">
                  <h2 className="blogTitle"  data-aos="fade-down" data-aos-duration="1000">
                    News And <span>Blog</span>
                  </h2>
                  <p className="blogDesc" data-aos="fade-right" data-aos-duration="1000">
                    Stay updated with the latest news, updates, and insights about our products and natural lifestyle.
                  </p>
        
                  <div className="blogGrid">
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
                        <a className="blogBtn" href="#contact">
                          READ MORE <FiArrowRight aria-hidden="true" />
                        </a>
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
                        <a className="blogBtn" href="#contact">
                          READ MORE <FiArrowRight aria-hidden="true" />
                        </a>
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
                        <h3 className="blogCardTitle">Fresh Goat Desi Ghee Prepared Naturally For Cooking Nutrition And Daily Use.</h3>
                        <a className="blogBtn" href="#contact">
                          READ MORE <FiArrowRight aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  </div>
                </div>
              </section> */}
    </main>
  )
}

export default Product
