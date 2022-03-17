import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import formatPrice from '../../utils/formatPrice'
import styles from './ProductCard.module.css'
import TickIcon from './icons/tick-icon'
import ArrowIcon from './icons/arrow-icon'
import ContactIcon from './icons/contact-icon'
import ViewIcon from './icons/view-icon'
import RemoveIcon from './icons/remove-icon'

interface OcProductCardProps {
  product: BuyerProduct
}

const OcProductCard: FunctionComponent<OcProductCardProps> = ({ product }) => {
  return (
    <div>
      <p className={styles.name}>{product.Name}</p>
      <p className={styles.description}>{product.Description}</p>
      {product.PriceSchedule?.PriceBreaks[0].Price && (
        <div className={styles.pricecontainer}>
          <p>
            Estimated cost{' '}
            <span className={styles.price}>
              {formatPrice(product.PriceSchedule?.PriceBreaks[0].Price)}
            </span>
          </p>
        </div>
      )}

      <div className={styles.bottom}>
        <ul className={styles.icons}>
          <li className={styles.iconItem}>
            <ContactIcon />
          </li>
          <li className={styles.iconItem}>
            <ViewIcon />
          </li>
          <li className={styles.iconItem}>
            <RemoveIcon />
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
        <button type="button" className="btn">
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default OcProductCard
