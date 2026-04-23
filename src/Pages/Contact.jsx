import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { useState } from 'react'
import about1 from '../assets/banner/about1.jpeg'



function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const whatsappMessage = `Contact Form Submission\n\nName: ${formData.name} ${formData.lastname}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`

    const url = `https://wa.me/923338399480?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    // Reset form after sending
    setFormData({
      name: '',
      lastname: '',
      email: '',
      subject: '',
      message: '',
    })
  }
  return (
    <main className="contactPage" aria-label="contact page">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${about1})` }}>
        {/* <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" /> */}

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">Contact</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              Home
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">Contact</span>
          </p>
        </div>
      </section>

      <section className="contactSection" aria-label="Contact content">
        <div className="contactGrid">
          <div className="contactLeft">
            <h2 className="contactTitle">Our Contacts</h2>
            <p className="contactDesc">
              Swift Sign Trading offers premium Desi Ghee and Natural Honey made from 100% natural ingredients. We ensure quality, freshness, and authentic taste in every product.
            </p>

            <div className="contactCards">
              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiMapPin />
                </div>
                <div>
                  <h3 className="contactCardTitle">Our Location</h3>
                  <p className="contactCardText">I-8 Markaz I 8 Markaz I-8, Islamabad, Pakistan</p>
                </div>
              </article>

              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="contactCardTitle">Phone</h3>
                  <p className="contactCardText">+92 333 8399480</p>
                </div>
              </article>

              <article className="contactCard">
                <div className="contactCardIcon" aria-hidden="true">
                  <FiMail />
                </div>
                <div>
                  <h3 className="contactCardTitle">Email</h3>
                  <p className="contactCardText">info@swiftsigngeneraltrading.com</p>
                </div>
              </article>
            </div>
          </div>

          <div className="contactRight" aria-label="Quick contact form">
            <h2 className="contactTitle">Quick Contact Form</h2>
            <form className="contactForm" onSubmit={handleSubmit}>
              <div className="contactFormGrid">
                <label className="contactField">
                  <span className="contactSr">Name</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Lastname</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="lastname"
                    placeholder="Lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Email</span>
                  <input
                    className="contactInput"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="contactField">
                  <span className="contactSr">Subject</span>
                  <input
                    className="contactInput"
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label className="contactField contactField--full">
                <span className="contactSr">Message</span>
                <textarea
                  className="contactTextarea"
                  name="message"
                  placeholder="Message"
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>

              <button className="contactBtn" type="submit">
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mapSection" aria-label="Map">
        <div className="mapInner">
          <iframe
            className="mapFrame"
            title="Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.8!2d73.0759443!3d33.6711939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95459918a25f:0x46495cfc8ce0a1a3!2sI-8%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2spk!4v1713177600000"
          />
        </div>
      </section>
    </main>
  )
}

export default Contact
