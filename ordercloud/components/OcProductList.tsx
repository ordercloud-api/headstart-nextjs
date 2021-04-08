import React, { FunctionComponent } from 'react'
import useOcProductList from '../lib/useOcProductList'
import { OcProductListOptions } from '../redux/ocProductList'
import OcProductCard from './OcProductCard'

interface OcProductListProps {
  options?: OcProductListOptions
}

const OcProductList: FunctionComponent<OcProductListProps> = ({ options }) => {
  const products = useOcProductList(options)

  return (
    <ol>
      {products &&
        products.map((p, i) => (
          <li key={i}>
            <OcProductCard product={p} />
          </li>
        ))}
    </ol>
  )
}

export default OcProductList
