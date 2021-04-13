import { FunctionComponent } from 'react'
import useOcProductList from '../hooks/useOcProductList'
import { OcProductListOptions } from '../redux/ocProductList'
import OcProductCard from './OcProductCard'

export interface OcProductListProps {
  options?: OcProductListOptions
}

const OcProductList: FunctionComponent<OcProductListProps> = ({ options }) => {
  const products = useOcProductList(options)

  return (
    <ol>
      {products &&
        products.map((p) => (
          <li key={p.ID}>
            <OcProductCard product={p} />
          </li>
        ))}
    </ol>
  )
}

export default OcProductList
