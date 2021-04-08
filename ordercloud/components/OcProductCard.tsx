import Link from 'next/link'
import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'

interface OcProductCardProps {
  product: BuyerProduct
}

const OcProductCard: FunctionComponent<OcProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.ID}`}>
      <a>
        <h2>{product.Name}</h2>
        <p>{product.Description}</p>
      </a>
    </Link>
  )
}

export default OcProductCard
