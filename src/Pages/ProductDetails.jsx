import { useMemo, useState } from 'react'
import about1 from '../assets/banner/about1.jpeg'
import { Link, useParams } from 'react-router-dom'
import { useOrder } from '../context/order.js'
import { useContent } from '../context/content.js'
import { formatRs } from '../utils/money.js'


function ProductDetails() {
  const { id } = useParams()
  const { products, settings } = useContent()
  const product = useMemo(() => products.find((p) => p.id === id), [id, products])
  const [qty, setQty] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [whatsappPromptOpen, setWhatsappPromptOpen] = useState(false)
  const [addedToast, setAddedToast] = useState(false)
  const { order, addToOrder, removeFromOrder } = useOrder()

  const activeVariant = selectedVariant || product?.variants?.[0]
  const price = Number(activeVariant?.price || product?.price) || 0
  const oldPrice = Number(product?.oldPrice)
  const showOldPrice = Number.isFinite(oldPrice) && oldPrice > price
  const totalPrice = price * qty

  const dec = () => setQty((v) => Math.max(1, v - 1))
  const inc = () => setQty((v) => v + 1)

  const detailed = useMemo(() => {
    return order
      .map((item) => {
        // Parse variant ID (format: productId__variantLabel or just productId)
        const isVariant = item.id.includes('__')
        const baseProductId = isVariant ? item.id.split('__')[0] : item.id
        const variantLabel = isVariant ? item.id.split('__')[1] : null

        const p = products.find((x) => x.id === baseProductId)
        if (!p) return null

        let variant = null
        if (variantLabel && p.variants) {
          variant = p.variants.find((v) => v.label === variantLabel)
        }

        return {
          product: p,
          variant,
          qty: item.qty,
          displayId: item.id,
          price: variant?.price || p.price,
        }
      })
      .filter(Boolean)
  }, [order, products])

  const orderTotal = useMemo(() => {
    return detailed.reduce((sum, x) => sum + (x.price || 0) * x.qty, 0)
  }, [detailed])

  const inOrder = product ? order.some((x) => x.id.startsWith(product.id)) : false

  const whatsappMessage = useMemo(() => {
    const productLink = `${window.location.origin}/product/${product?.id ?? ''}`

    if (detailed.length) {
      const lines = detailed
        .map(({ product: p, variant, qty: q, price: itemPrice }, idx) => {
          const rowPrice = itemPrice || Number(p.price) || 0
          const rowTotal = rowPrice * q
          const link = `${window.location.origin}/product/${p.id}`
          const imageUrl = new URL(p.image, window.location.origin).href
          const variantStr = variant ? ` (${variant.label})` : ''
          return `${idx + 1}) ${p.title}${variantStr}\n   Code: ${p.code}\n   Qty: ${q}\n   Price: ${formatRs(
            rowPrice,
          )}\n   Total: ${formatRs(rowTotal)}\n   Link: ${link}\n   Image: ${imageUrl}`
        })
        .join('\n\n')
      return `Order Request\n\n${lines}\n\nGrand Total: ${formatRs(orderTotal)}`
    }

    if (!product) return 'Order Request\n\nProduct not found.'

    const imageUrl = new URL(product.image, window.location.origin).href
    const variantLabel = activeVariant?.label || '1kg'
    return `Order Request\n\nProduct: ${product.title}\nVariant: ${variantLabel}\nProduct Code: ${product.code}\nQuantity: ${qty}\nPrice per unit: ${formatRs(
      price,
    )}\nTotal: ${formatRs(totalPrice)}\nLink: ${productLink}\nImage: ${imageUrl}`
  }, [detailed, orderTotal, price, product, qty, totalPrice, activeVariant])

  const openWhatsApp = () => {
    const whatsappNumber = String(settings.whatsapp_number || '923338399480').replace(/[^\d]/g, '')
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setWhatsappPromptOpen(false)
  }

  const addNow = () => {
    if (!product) return
    const variantLabel = activeVariant?.label || '1kg'
    const variantId = `${product.id}__${variantLabel}`
    addToOrder(variantId, qty)
    setAddedToast(true)
    window.setTimeout(() => setAddedToast(false), 1200)
  }

  if (!product) {
    return (
      <main className="pdPage" aria-label="Product details">
        <section className="pdSection">
          <div className="pdInner">
            <h1 className="pdTitle">Product not found</h1>
            <Link className="pdBackBtn" to="/product">
              Back to products
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="pdPage" aria-label="Product details">
      <section className="aboutHero" aria-label="About hero" style={{ backgroundImage: `url(${about1})` }}>
        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">Product Details</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              Home
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <span className="aboutHero__crumbCurrent">Product Details</span>
          </p>
        </div>
      </section>

      <section className="pdSection">
        <div className="pdInner pdGrid">
          <div className="pdMedia">
            <img className="pdImg" src={product.image} alt={product.title} />
          </div>

          <div className="pdContent">
            <h1 className="pdHeading">{product.title}</h1>
            <p className="pdCode">
              Product Code: <span>{product.code}</span>
            </p>

            <p className="pdPriceRow">
              {showOldPrice ? <span className="pdOld">{formatRs(oldPrice)}</span> : null}
              <span className="pdNow">{formatRs(price)}</span>
            </p>

            {product.variants?.length ? (
              <div className="pdVariantsContainer">
                <label className="pdVariantsLabel">Select Size:</label>
                <div className="pdVariants" aria-label="Available weights and prices">
                  {product.variants.map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      className={`pdVariantBtn ${activeVariant?.label === v.label ? 'pdVariantBtn--active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                      aria-pressed={activeVariant?.label === v.label}
                    >
                      <span className="pdVariantBtnLabel">{v.label}</span>
                      <span className="pdVariantBtnPrice">{formatRs(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="pdQtyRow" aria-label="Quantity">
              <span className="pdQtyLabel">Quantity</span>
              <div className="pdQty">
                <button type="button" className="pdQtyBtn" onClick={dec} aria-label="Decrease quantity">
                  -
                </button>
                <input
                  className="pdQtyInput"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  aria-label="Quantity"
                />
                <button type="button" className="pdQtyBtn" onClick={inc} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>

            <div className="pdTotalRow" aria-label="Total price">
              <span>Total Price</span>
              <span className="pdTotal">{formatRs(totalPrice)}</span>
            </div>

            <div className="pdActions">
              <button type="button" className="pdActionBtn" onClick={addNow}>
                Add To Cart
              </button>
              {inOrder ? (
              <button
                  type="button"
                  className="pdActionBtn pdActionBtn--ghost"
                  onClick={() => {
                    if (product.variants?.length) {
                      const variantLabel = activeVariant?.label || '1kg'
                      const variantId = `${product.id}__${variantLabel}`
                      removeFromOrder(variantId)
                    } else {
                      removeFromOrder(product.id)
                    }
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="pdActionBtn pdActionBtn--whatsapp"
                  onClick={() => setWhatsappPromptOpen(true)}
                >
                  Order on WhatsApp
                </button>
              )}
              <Link className="pdActionBtn pdActionBtn--light" to="/order">
                View Order
              </Link>
              {/* <Link className="pdActionBtn pdActionBtn--light" to="/product">
                Back
              </Link> */}
            </div>

            {addedToast ? <p className="pdToast">Added to order list</p> : null}
          </div>
        </div>
      </section>

      {whatsappPromptOpen ? (
        <div
          className="pdModalBackdrop"
          role="presentation"
          onClick={() => setWhatsappPromptOpen(false)}
        >
          <div
            className="pdModal"
            role="dialog"
            aria-modal="true"
            aria-label="Open WhatsApp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="pdModalTitle">Open WhatsApp?</h2>
            <p className="pdModalText">
              Your order message will open in WhatsApp. Click "Open WhatsApp" to continue.
            </p>
            <div className="pdModalActions">
              <button type="button" className="pdModalBtn pdModalBtn--primary" onClick={openWhatsApp}>
                Open WhatsApp
              </button>
              <button
                type="button"
                className="pdModalBtn pdModalBtn--ghost"
                onClick={() => setWhatsappPromptOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default ProductDetails
