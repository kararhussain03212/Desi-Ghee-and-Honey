import { Link } from 'react-router-dom'
import food from '../assets/icons/food.png'
import apitherapy from '../assets/icons/apitherapy.png'
import honeyicon from '../assets/icons/honey.png'
// import honeyL from '../assets/images/honeyL.png'
import cow from '../assets/images/cow.png'
import slide1 from '../assets/images/slide1.jpg'
import about1 from '../assets/banner/about1.jpeg'
import honey1 from '../assets/icons/honey1.png'
import mockuphoney from '../assets/images/mockuphoney.png'
import guee from '../assets/icons/guee.png'
import icon from '../assets/icons/icon.png'
import icon2 from '../assets/images/icon2.png'
// import icon1 from '../assets/images/icon1.png'
import icon3 from '../assets/images/icon3.png'
import aboutImg from '../assets/images/about1.png'
// import { FiArrowRight } from 'react-icons/fi'
import { FaFacebookF, FaLinkedinIn, FaXTwitter, } from 'react-icons/fa6'
import { FaStar } from 'react-icons/fa'
import "../App.css"
import { FiCheck } from 'react-icons/fi'


function About() {
  return (
    <main className="aboutPage" aria-label="About page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${about1})` }}>
        {/* <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" /> */}

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">About Us</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              Home
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">About</span>
          </p>
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
                  {/* <Link className="aboutHoneyBtn" to="/about" data-aos="fade-up" data-aos-duration="1000">
                    Read more
                  </Link> */}
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
                        <strong>Provides </strong>Natural Energy &amp; Strength
                      </span>
                    </li>
                  </ul>
                </div>
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
                   Cow Desi Ghee<span className="aboutCompanyAccent">100% Natural</span> & Traditional Goodness
                 </h2>
                 <div className="aboutCompanyMarks" aria-hidden="true" data-aos="fade-up" data-aos-duration="1000">
                   <span />
                   <span />
                 </div>
                 <p className="aboutCompanyText" data-aos="fade-right" data-aos-duration="1000">
                   Our Pure Cow Desi Ghee is made from 100% natural and fresh cow milk, ensuring premium quality and rich taste. Prepared using traditional methods, this ghee is completely pure, chemical-free, and full of natural aroma and flavor. It enhances the taste of your everyday meals like roti, paratha, rice, and various dishes.
                 </p>
                 {/* <Link className="aboutCompanyBtn" to="/about" data-aos="fade-up" data-aos-duration="1000">
                   MORE ABOUT <FiArrowRight aria-hidden="true" />
                 </Link> */}
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

      <section className="processSection" aria-label="Honey production process">
        <div className="processInner">
          <div className="processGrid">
            <article className="processCard" data-aos="fade-right" data-aos-duration="1000">
              <img className="processIcon" src={icon} alt="" aria-hidden="true" loading="lazy" />
              <h3 className="processStep">
                <span className="processNum"></span> Flowers produce nectar and attract our bees
              </h3>
              <p className="processDesc">Natural flowers produce nectar, and bees are attracted to collect it from fresh blossoms</p>
            </article>

            <article className="processCard" data-aos="fade-up" data-aos-duration="1000">
              <img className="processIcon" src={icon2} alt="" aria-hidden="true" loading="lazy" />
              <h3 className="processStep">
                <span className="processNum"></span> Bees collect the nectar and carry it to the beehive
              </h3>
              <p className="processDesc">Bees carry the collected nectar back to the hive to begin the natural honey-making process</p>
            </article>

            <article className="processCard" data-aos="fade-up" data-aos-duration="1000">
              <img className="processIcon" src={guee} alt="" aria-hidden="true" loading="lazy" />
              <h3 className="processStep">
                <span className="processNum"></span> Pure Desi Ghee Naturally Rich & Nutrient-Dense
              </h3>
              <p className="processDesc">Pure Desi Ghee matures naturally, delivering rich taste and essential nutrients.</p>
            </article>

            <article className="processCard" data-aos="fade-left" data-aos-duration="1000">
              <img className="processIcon" src={honey1} alt="" aria-hidden="true" loading="lazy" />
              <h3 className="processStep">
                <span className="processNum"></span> Honey is carefully collected  for packaging.
              </h3>
              <p className="processDesc">Honey is carefully harvested from natural sources, and freshness, taste, and nutritional value.</p>
            </article>
          </div>

          {/* <div className="processCta">
            <Link className="processBtn" to="/product" data-aos="zoom-in" data-aos-duration="1000">
              View more
            </Link>
          </div> */}
        </div>
      </section>

      
       
    </main>
  )
}

export default About
