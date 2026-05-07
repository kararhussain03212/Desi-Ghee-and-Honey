import { useContent } from '../context/content.js'
import { getSettingText } from '../utils/siteSettings.js'

function Marco() {
  const { settings } = useContent()
  const leftText = getSettingText(settings, 'topbar_left_text', '').trim()
  const rightTitle = getSettingText(settings, 'topbar_right_title', '').trim()
  const contactPrefix = getSettingText(settings, 'topbar_contact_prefix', '').trim()

  const showLeft = Boolean(leftText)
  const showRightTitle = Boolean(rightTitle)
  const showContact = Boolean(contactPrefix)

  if (!showLeft && !showRightTitle && !showContact) return null

  return (
    <div className="top-bar" role="region" aria-label="Top announcement bar">
      {showLeft ? <p className="top-bar__leftFixed">{leftText}</p> : null}

      {(showRightTitle || showContact) ? (
        <div className="top-bar__tickerWrap" aria-label="Moving announcements">
          <marquee className="top-bar__marquee" direction="left" scrollamount="5" behavior="scroll">
            {showRightTitle ? <span className="top-bar__pill">{rightTitle}</span> : null}
            {showContact ? <span className="top-bar__pill top-bar__pill--contact">{contactPrefix}</span> : null}
          </marquee>
        </div>
      ) : null}
    </div>
  )
}

export default Marco
