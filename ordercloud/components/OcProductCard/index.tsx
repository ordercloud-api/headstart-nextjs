import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import styles from './ProductCard.module.css'

interface OcProductCardProps {
  product: BuyerProduct
}

const OcProductCard: FunctionComponent<OcProductCardProps> = ({ product }) => {
  return (
    <div>
      <p className={styles.name}>{product.Name}</p>
      <p>{product.Description}</p>
    </div>
  )
}

export default OcProductCard
