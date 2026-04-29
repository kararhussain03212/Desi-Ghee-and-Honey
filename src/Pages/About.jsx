import { Link } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import food from '../assets/icons/food.png'
import apitherapy from '../assets/icons/apitherapy.png'
import honeyicon from '../assets/icons/honey.png'
import processHoneyIcon from '../assets/icons/honey1.png'
import processGheeIcon from '../assets/icons/guee.png'
import processIconA from '../assets/icons/icon.png'
import processIconB from '../assets/images/icon2.png'
import { useContent } from '../context/content.js'
import { getSettingJson, getSettingText } from '../utils/siteSettings.js'
import '../App.css'

const CATEGORY_ICON_MAP = {
  food,
  apitherapy,
  honey: honeyicon,
}

const PROCESS_ICON_FALLBACKS = [processIconA, processIconB, processGheeIcon, processHoneyIcon]

function About() {
  const { settings } = useContent()
  const backendBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost/honey-ghee/backend').replace(/\/$/, '')
  const toAssetUrl = (path, fallback) => {
    if (!path) return fallback
    if (/^https?:\/\//i.test(path)) return path
    return `${backendBase}/${String(path).replace(/^\//, '')}`
  }
  const safeSrc = (value) => {
    const src = typeof value === 'string' ? value.trim() : ''
    return src || null
  }

  const heroImage = toAssetUrl(getSettingText(settings, 'about_page_hero_image', ''), '')
  const pageTitle = getSettingText(settings, 'about_page_title', 'About Us')
  const breadcrumbHome = getSettingText(settings, 'about_page_breadcrumb_home', 'Home')
  const breadcrumbCurrent = getSettingText(settings, 'about_page_breadcrumb_current', 'About')

  const infoKicker = getSettingText(settings, 'about_page_info_kicker', 'Information')
  const infoTitle = getSettingText(settings, 'about_page_info_title', 'About Honey & Desi Ghee')
  const infoDescription = getSettingText(
    settings,
    'about_page_info_description',
    'Our honey is collected from natural floral sources and packed with taste and nutrients. Our desi ghee is prepared using traditional methods to deliver rich aroma, purity, and everyday goodness.',
  )
  const infoImage = toAssetUrl(getSettingText(settings, 'about_page_info_image', ''), '')

  const propertiesTitle = getSettingText(settings, 'about_page_properties_title', 'Useful Properties Of Honey & Desi Ghee')
  const properties = getSettingJson(settings, 'about_page_properties', [])

  const companyKicker = getSettingText(settings, 'about_page_company_kicker', 'About our Company')
  const companyTitle = getSettingText(settings, 'about_page_company_title', 'Cow Desi Ghee')
  const companyAccent = getSettingText(settings, 'about_page_company_accent', '100% Natural')
  const companySuffix = getSettingText(settings, 'about_page_company_suffix', '& Traditional Goodness')
  const companyDescription = getSettingText(
    settings,
    'about_page_company_description',
    'Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor. It enhances the taste of your everyday meals like roti, paratha, rice, and various dishes.',
  )
  const companyImage = toAssetUrl(getSettingText(settings, 'about_page_company_image', ''), '')

  const categoryTitle = getSettingText(settings, 'about_page_category_title', 'Our Honey Category')
  const categoryDescription = getSettingText(
    settings,
    'about_page_category_description',
    'Explore our premium honey collection, carefully selected to bring you the purest taste of nature. Our honey range includes high-quality, 100% natural varieties that are rich in flavor and packed with essential nutrients.',
  )
  const categoryImage = toAssetUrl(getSettingText(settings, 'about_page_category_image', ''), '')

  const categories = getSettingJson(settings, 'about_page_categories', [])

  const processCards = getSettingJson(settings, 'about_page_process_cards', [])

  return (
    <main className="aboutPage" aria-label="About page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">{pageTitle}</h1>
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

      <section className="aboutHoneySection" aria-label="About Honey and Desi Ghee">
        <div className="aboutHoneyGrid">
          <div className="aboutHoneyLeft">
            <p className="aboutHoneyKicker" data-aos="fade-down" data-aos-duration="1000">{infoKicker}</p>
            <h2 className="aboutHoneyTitle" data-aos="fade-right" data-aos-duration="1000">{infoTitle}</h2>
            <div className="aboutHoneyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
              <span />
            </div>
            <p className="aboutHoneyText" data-aos="fade-right" data-aos-duration="1000">
              {infoDescription}
            </p>
          </div>

          <div className="aboutHoneyMedia">
            {safeSrc(infoImage) ? (
              <img
                className="aboutHoneyImg"
                src={safeSrc(infoImage)}
                alt="Honey and desi ghee"
                loading="lazy"
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="1000"
              />
            ) : null}
          </div>

          <div className="aboutHoneyRight">
            <h3 className="aboutHoneyPropsTitle" data-aos="fade-down" data-aos-duration="1000">
              {propertiesTitle}
            </h3>
            <ul className="aboutHoneyProps">
              {properties.map((item, index) => (
                <li key={`${item}-${index}`} className="aboutHoneyProp" data-aos="fade-right" data-aos-duration="1000">
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

      <section className="aboutCompanySection" id="company" aria-label="About our company">
        <div className="aboutCompanyGrid">
          <div className="aboutCompanyMedia">
            <div className="aboutCompanyImageWrap">
              {safeSrc(companyImage) ? (
                <img className="aboutCompanyImage" src={safeSrc(companyImage)} alt="Desi ghee" data-aos="zoom-out-up" data-aos-duration="1000" />
              ) : null}
            </div>
          </div>

          <div className="aboutCompanyContent">
            <p className="aboutCompanyKicker" data-aos="fade-down" data-aos-duration="1000">
              {companyKicker}
            </p>
            <h2 className="aboutCompanyTitle" data-aos="fade-right" data-aos-duration="1000">
              {companyTitle}<span className="aboutCompanyAccent">{companyAccent}</span> {companySuffix}
            </h2>
            <div className="aboutCompanyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>
            <p className="aboutCompanyText" data-aos="fade-right" data-aos-duration="1000">
              {companyDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="categorySection" id="about" aria-label="Honey category">
        <div className="categoryGrid">
          <div className="categoryLeft">
            <h2 className="categoryTitle" data-aos="fade-down" data-aos-duration="1000">
              {categoryTitle}
            </h2>
            <p className="categoryDesc" data-aos="fade-right" data-aos-duration="1000">
              {categoryDescription}
            </p>
            <div className="categoryMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
              <span />
              <span />
            </div>

            <div className="categoryList">
              {categories.map((item, index) => {
                const fallbackIcon = CATEGORY_ICON_MAP[String(item?.icon || '').toLowerCase()] || food
                const iconSrc = toAssetUrl(item?.icon_url, fallbackIcon)

                return (
                  <article key={`${item?.title || 'category'}-${index}`} className="categoryItem" data-aos="fade-right" data-aos-duration="1000">
                    <div className="categoryIcon">
                      <img src={iconSrc} alt="" />
                    </div>
                    <div>
                      <h3 className="categoryItemTitle">{item?.title || 'Honey Category'}</h3>
                      <p className="categoryItemDesc">{item?.description || ''}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="categoryRight">
            <div className="categoryImages">
              {safeSrc(categoryImage) ? (
                <img className="categoryImg categoryImg--main" src={safeSrc(categoryImage)} alt="Honey" data-aos="zoom-in-up" data-aos-duration="1000" />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="processSection" aria-label="Honey production process">
        <div className="processInner">
          <div className="processGrid">
            {processCards.map((item, index) => {
              const fallbackIcon = PROCESS_ICON_FALLBACKS[index % PROCESS_ICON_FALLBACKS.length]
              const iconSrc = toAssetUrl(item?.icon_url, fallbackIcon)
              const aos = index === 0 ? 'fade-right' : index === processCards.length - 1 ? 'fade-left' : 'fade-up'

              return (
                <article key={`${item?.title || 'process'}-${index}`} className="processCard" data-aos={aos} data-aos-duration="1000">
                  <img className="processIcon" src={iconSrc} alt="" aria-hidden="true" loading="lazy" />
                  <h3 className="processStep">
                    <span className="processNum"></span> {item?.title || ''}
                  </h3>
                  <p className="processDesc">{item?.description || ''}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
