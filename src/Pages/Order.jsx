import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { useOrder } from '../context/order.js'
import { useContent } from '../context/content.js'
import { formatRs } from '../utils/money.js'
import slide1 from '../assets/images/slide1.jpg'
// import honeyL from '../assets/images/honeyL.png'
import icon2 from '../assets/images/icon2.png'


function Order() {
  const { products, settings } = useContent()
  const { order, orderCount, setOrderQty, removeFromOrder, clearOrder } = useOrder()
  const [whatsappPromptOpen, setWhatsappPromptOpen] = useState(false)

  const detailed = useMemo(() => {
    return order
      .map((item) => {
        // Parse variant ID (format: productId__variantLabel or just productId)
        const isVariant = item.id.includes('__')
        const baseProductId = isVariant ? item.id.split('__')[0] : item.id
        const variantLabel = isVariant ? item.id.split('__')[1] : null

        const product = products.find((p) => p.id === baseProductId)
        if (!product) return null

        let variant = null
        if (variantLabel && product.variants) {
          variant = product.variants.find((v) => v.label === variantLabel)
        }

        return {
          product,
          variant,
          qty: item.qty,
          displayId: item.id,
          price: variant?.price || product.price,
        }
      })
      .filter(Boolean)
  }, [order, products])

  const totals = useMemo(() => {
    const subTotal = detailed.reduce((sum, x) => sum + (x.price || 0) * x.qty, 0)
    return { subTotal, total: subTotal }
  }, [detailed])

  const whatsappMessage = useMemo(() => {
    if (!detailed.length) return 'Order Request\n\nNo items selected.'
    const lines = detailed
      .map(({ product, variant, qty, price }, idx) => {
        const rowTotal = price * qty
        const link = `${window.location.origin}/product/${product.slug || product.id}`
        const imageUrl = new URL(product.image, window.location.origin).href
        const variantStr = variant ? ` (${variant.label})` : ''
        return `${idx + 1}) ${product.title}${variantStr}\n   Code: ${product.code}\n   Qty: ${qty}\n   Price: ${formatRs(
          price,
        )}\n   Total: ${formatRs(rowTotal)}\n   Link: ${link}\n   Image: ${imageUrl}`
      })
      .join('\n\n')

    return `Order Request\n\n${lines}\n\nGrand Total: ${formatRs(totals.total)}`
  }, [detailed, totals.total])

  const openWhatsApp = () => {
    const whatsappNumber = String(settings.whatsapp_number || '923338399480').replace(/[^\d]/g, '')
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setWhatsappPromptOpen(false)
  }

  return (
    <main className="orderPage" aria-label="Order page">
      {/* <section className="aboutHero" aria-label="About hero" style={{backgroundImage: `url(${slide1})`}}>
        <img className="aboutHero__decor aboutHero__decor--left" src={honeyL} alt="" />
        <img className="aboutHero__decor aboutHero__decor--right" src={icon2} alt="" />

        <div className="aboutHero__inner" data-aos="fade-up" data-aos-duration="1000">
          <h1 className="aboutHero__title">Order Details</h1>
          <p className="aboutHero__crumbs" aria-label="Breadcrumb">
            <Link className="aboutHero__crumbLink" to="/">
              Home
            </Link>{' '}
            <span className="aboutHero__sep" aria-hidden="true">
              /
            </span>{' '}
            <Link className="aboutHero__crumbCurrent" to="/product">
              Product
            </Link>
          </p>
        </div>
      </section> */}


      <section className="orderSection">
        <div className="orderInner">
          <div className="orderTop">
            <h1 className="orderTitle">Your Order</h1>
            <p className="orderSub">Total items: {orderCount}</p>
          </div>

          {detailed.length === 0 ? (
            <div className="orderEmpty">
              <p className="orderEmptyText">No products added yet.</p>
              <Link className="orderBtn orderBtn--primary" to="/product">
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <div className="orderTableCard" aria-label="Order table">
                <div className="orderTableScroll">
                  <table className="orderTable">
                    <thead>
                      <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Total</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailed.map(({ product, variant, qty, displayId, price }) => {
                        const rowTotal = price * qty
                        return (
                          <tr key={displayId}>
                            <td>
                              <img className="orderRowImg" src={product.image} alt={product.title} loading="lazy" />
                            </td>
                            <td>
                              <p className="orderRowTitle">
                                {product.title}
                                {variant ? <span className="orderRowVariant"> ({variant.label})</span> : null}
                              </p>
                              <p className="orderRowMeta">Code: {product.code}</p>
                            </td>
                            <td>
                              <div className="orderQty">
                                <button
                                  type="button"
                                  className="orderQtyBtn"
                                  onClick={() => setOrderQty(displayId, qty - 1)}
                                  aria-label={`Decrease ${product.title} quantity`}
                                >
                                  -
                                </button>
                                <input
                                  className="orderQtyInput"
                                  type="number"
                                  min="1"
                                  value={qty}
                                  onChange={(e) => setOrderQty(displayId, e.target.value)}
                                  aria-label={`${product.title} quantity`}
                                />
                                <button
                                  type="button"
                                  className="orderQtyBtn"
                                  onClick={() => setOrderQty(displayId, qty + 1)}
                                  aria-label={`Increase ${product.title} quantity`}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="orderMoney">{formatRs(price)}</td>
                            <td className="orderMoney">{formatRs(rowTotal)}</td>
                            <td>
                              <button
                                type="button"
                                className="orderTrash"
                                onClick={() => removeFromOrder(displayId)}
                                aria-label={`Remove ${product.title}`}
                              >
                                <FiTrash2 aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="orderActions">
                  <Link className="orderBtn orderBtn--primary" to="/product">
                    More Products Add
                  </Link> 
                  <button type="button" className="orderBtn orderBtn--dark" onClick={() => setWhatsappPromptOpen(true)}>
                    Order on WhatsApp
                  </button>
                  <button type="button" className="orderBtn orderBtn--ghost" onClick={clearOrder}>
                    Clear
                  </button>
                </div>
              </div>

              <aside className="orderTotals" aria-label="Totals">
                <div className="orderTotalsRow">
                  <span>Sub Total</span>
                  <span>{formatRs(totals.subTotal)}</span>
                </div>
                <div className="orderTotalsDivider" aria-hidden="true" />
                <div className="orderTotalsRow orderTotalsRow--total">
                  <span>Total</span>
                  <span>{formatRs(totals.total)}</span>
                </div>
              </aside>
            </>
          )}
        </div>
      </section>

      {whatsappPromptOpen ? (
        <div className="orderModalBackdrop" role="presentation" onClick={() => setWhatsappPromptOpen(false)}>
          <div
            className="orderModal"
            role="dialog"
            aria-modal="true"
            aria-label="Open WhatsApp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="orderModalTitle">Open WhatsApp?</h2>
            <p className="orderModalText">Your order message will open in WhatsApp. Click “Open WhatsApp” to continue.</p>
            <div className="orderModalActions">
              <button type="button" className="orderModalBtn orderModalBtn--primary" onClick={openWhatsApp}>
                Open WhatsApp
              </button>
              <button type="button" className="orderModalBtn orderModalBtn--ghost" onClick={() => setWhatsappPromptOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default Order
