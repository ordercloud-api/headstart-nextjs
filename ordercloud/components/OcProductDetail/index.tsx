import { FormEvent, FunctionComponent, useCallback, useState } from 'react'
import useOcProductDetail from '../../hooks/useOcProductDetail'
import { createLineItem, updateLineItem } from '../../redux/ocCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'
import OcQuantityInput from '../OcQuantityInput'

interface OcProductDetailProps {
  productId: string
  lineItemId?: string
  onLineItemAdded?: () => void
  onLineItemUpdated?: () => void
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({
  productId,
  lineItemId,
  onLineItemAdded,
  onLineItemUpdated,
}) => {
  const dispatch = useOcDispatch()
  const { product, specs, variants } = useOcProductDetail(productId)
  const [loading, setLoading] = useState(false)

  const lineItem = useOcSelector((s) =>
    lineItemId && s.ocCurrentOrder.lineItems
      ? s.ocCurrentOrder.lineItems.find((li) => li.ID === lineItemId)
      : undefined
  )

  const [quantity, setQuantity] = useState(
    lineItem ? lineItem.Quantity : (product && product.PriceSchedule.MinQuantity) || 1
  )

  const handleAddToCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await dispatch(createLineItem({ ProductID: product.ID, Quantity: quantity }))
      setLoading(false)
      if (onLineItemAdded) {
        onLineItemAdded()
      }
    },
    [dispatch, product, quantity, onLineItemAdded]
  )

  const handleUpdateCart = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)
      await dispatch(updateLineItem({ ...lineItem, Quantity: quantity }))
      setLoading(false)
      if (onLineItemUpdated) {
        onLineItemUpdated()
      }
    },
    [dispatch, lineItem, quantity, onLineItemUpdated]
  )

  return (
    <div>
      <h2>Product</h2>
      {product && (
        <form onSubmit={lineItem ? handleUpdateCart : handleAddToCart}>
          <OcQuantityInput
            controlId="addToCart"
            priceSchedule={product.PriceSchedule}
            quantity={quantity}
            onChange={setQuantity}
          />
          <button type="submit" disabled={loading}>
            {`${lineItem ? 'Update' : 'Add To'} Cart`}
          </button>
        </form>
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
