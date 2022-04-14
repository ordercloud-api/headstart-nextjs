import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import Link from 'next/link'
import formatPrice from '../../../ordercloud/utils/formatPrice'
import styles from './ProductCard.module.css'
import TickIcon from './icons/tick-icon'
import ArrowIcon from './icons/arrow-icon'
import ContactIcon from './icons/contact-icon'
import ViewIcon from './icons/view-icon'
import RemoveIcon from './icons/remove-icon'

const OcProductCard = ({ worksheet, product }) => {
  const promotionDiscount = worksheet?.LineItems[0]?.PromotionDiscount
  const hasPromotion = promotionDiscount !== 0
  const worksheetId = worksheet?.Order?.ID
  const isSubmitted = worksheet?.Order.IsSubmitted

  if (!product) {
    return null
  }

  return (
    <div className={`${styles.container} ${isSubmitted ? styles.submitted : ''}`}>
      <p className={styles.name}>{product.Name}</p>
      <div className={styles.middle}>
        <p className={styles.description}>{product.Description}</p>
        {hasPromotion && (
          <div className={styles.pricecontainer}>
            <span>Estimated cost</span>{' '}
            <span className={styles.price}>{formatPrice(promotionDiscount)}</span>
          </div>
        )}
        {product.PriceSchedule?.PriceBreaks[0].Price && !hasPromotion && (
          <div className={styles.pricecontainer}>
            <p>
              Base cost{' '}
              <span className={styles.price}>
                {formatPrice(product.PriceSchedule?.PriceBreaks[0].Price)}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <ul className={styles.icons}>
          <li className={styles.iconItem}>
            <ContactIcon customClass={undefined} />
          </li>
          <li className={styles.iconItem}>
            <ViewIcon customClass={undefined} />
          </li>
          <li className={styles.iconItem}>
            <RemoveIcon customClass={undefined} />
          </li>
        </ul>
        {isSubmitted ? (
          <ul className={styles.list}>
            <li className={`${styles.item} ${isSubmitted ? styles.submittedIcon : ''}`}>
              <TickIcon customClass={styles.svg} />
              Send to terminal
            </li>
          </ul>
        ) : (
          <ul className={styles.list}>
            <li className={styles.item}>
              <TickIcon customClass={styles.svg} />
              Select service
            </li>
            <li className={styles.item}>
              {hasPromotion ? (
                <TickIcon customClass={styles.svg} />
              ) : (
                <ArrowIcon customClass={styles.svg} />
              )}
              Provide details
            </li>
            <li className={styles.item}>
              <ArrowIcon customClass={styles.svg} />
              Send request
            </li>
          </ul>
        )}

        {!isSubmitted && (
          <>
            {hasPromotion ? (
              <Link href={`/sendRequest/${worksheetId}`}>
                <a className="btn">Send request</a>
              </Link>
            ) : (
              <Link href={`/appointmentListing/${worksheetId}`}>
                <a className="btn">Add details</a>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OcProductCard
