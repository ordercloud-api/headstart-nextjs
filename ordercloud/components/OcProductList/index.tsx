import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import useOcProductList from '../../hooks/useOcProductList'
import { OcProductListOptions } from '../../redux/ocProductList'
import OcProductCard from '../OcProductCard'
import styles from './ProductList.module.css'

export interface OcProductListProps {
  options?: OcProductListOptions
  renderItem?: (product: BuyerProduct) => JSX.Element
}

const OcProductList: FunctionComponent<OcProductListProps> = ({ options, renderItem }) => {
  const products = useOcProductList(options)

  return (
    <ul className={styles.list}>
      {products &&
        products.map((p) => (
          <li className={styles.product} key={p.ID}>
            {renderItem ? renderItem(p) : <OcProductCard product={p} />}
          </li>
        ))}
    </ul>
  )
}

export default OcProductList
