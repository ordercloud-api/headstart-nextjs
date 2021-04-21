import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'

interface OcProductCardProps {
  product: BuyerProduct
}

const OcProductCard: FunctionComponent<OcProductCardProps> = ({ product }) => {
  return (
    <div>
      <h2>{product.Name}</h2>
      <p>{product.Description}</p>
    </div>
  )
}

export default OcProductCard
