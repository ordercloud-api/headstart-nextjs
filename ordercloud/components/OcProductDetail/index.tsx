import { FunctionComponent } from 'react'
import useOcProductDetail from '../../hooks/useOcProductDetail'
import { createLineItem } from '../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../redux/ocStore'

interface OcProductDetailProps {
  productId: string
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({ productId }) => {
  const dispatch = useOcDispatch()
  const { product, specs, variants } = useOcProductDetail(productId)
  return (
    <div>
      {product && (
        <button
          type="button"
          onClick={() => dispatch(createLineItem({ ProductID: product.ID, Quantity: 1 }))}
        >
          Add To Cart
        </button>
      )}
      <h2>Product</h2>
      <pre>
        <code>{JSON.stringify(product, null, 2)}</code>
      </pre>
      {specs && (
        <>
          <h2>Specs</h2>
          <pre>
            <code>{JSON.stringify(specs, null, 2)}</code>
          </pre>
        </>
      )}
      {variants && (
        <>
          <h2>Variants</h2>
          <pre>
            <code>{JSON.stringify(variants, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  )
}

export default OcProductDetail
