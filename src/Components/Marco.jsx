import { useContent } from '../context/content.js'
import { getSettingText } from '../utils/siteSettings.js'

function Marco() {
  const { settings } = useContent()
  const leftText = getSettingText(settings, 'topbar_left_text', 'Natural Desi Ghee & Honey')
  const rightTitle = getSettingText(settings, 'topbar_right_title', 'Swift Sign Honey & Desi Ghee')
  const contactPrefix = getSettingText(settings, 'topbar_contact_prefix', 'Contact:')

  return (
    <>
    <div className="top-bar">
         <div className="left-text">
            {leftText}
         </div>

       <div className="right-text">
         <p>{rightTitle}</p>
         <span>{contactPrefix}</span>
        </div>
      </div>
    </>
  )
}

export default Marco
