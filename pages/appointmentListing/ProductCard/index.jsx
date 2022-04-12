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

const OcProductCard = ({ product, worksheetId, promotionDiscount }) => {
  const hasPromotion = promotionDiscount !== 0

  if (!product) {
    return null
  }

  return (
    <div className={styles.container}>
      <p className={styles.name}>{product.Name}</p>
      <p className={styles.description}>{product.Description}</p>
      {hasPromotion && (
        <div className={styles.pricecontainer}>
          <p>
            Estimated cost <span className={styles.price}>{formatPrice(promotionDiscount)}</span>
          </p>
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
        <ul className={styles.list}>
          <li className={styles.item}>
            <TickIcon customClass={styles.svg} />
            Select service
          </li>
          <li className={styles.item}>
            <TickIcon customClass={styles.svg} />
            Provide details
          </li>
          <li className={styles.item}>
            <ArrowIcon customClass={styles.svg} />
            Send request
          </li>
        </ul>
        {hasPromotion ? (
          <Link href={`/sendRequest/${worksheetId}`}>
            <a className="btn">Send request</a>
          </Link>
        ) : (
          <Link href={`/appointmentListing/${worksheetId}`}>
            <a className="btn">Add details</a>
          </Link>
        )}

        {/* <button type="button" className="btn">
          Add details
        </button> */}
      </div>
    </div>
  )
}

export default OcProductCard
