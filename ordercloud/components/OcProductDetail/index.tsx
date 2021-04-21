import { FunctionComponent, useCallback, useState } from 'react'
import useOcProductDetail from '../../hooks/useOcProductDetail'
import { createLineItem } from '../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../redux/ocStore'
import OcQuantityInput from '../OcQuantityInput'

interface OcProductDetailProps {
  productId: string
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({ productId }) => {
  const dispatch = useOcDispatch()
  const { product, specs, variants } = useOcProductDetail(productId)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(product ? product.PriceSchedule.MinQuantity : 1)

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true)
    await dispatch(createLineItem({ ProductID: product.ID, Quantity: quantity }))
    setAddingToCart(false)
  }, [dispatch, product, quantity])

  return (
    <div>
      <h2>Product</h2>
      {product && (
        <>
          <OcQuantityInput
            controlId="addToCart"
            priceSchedule={product.PriceSchedule}
            quantity={quantity}
            onChange={setQuantity}
          />
          <button type="button" onClick={handleAddToCart} disabled={addingToCart}>
            Add To Cart
          </button>
        </>
      )}
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
