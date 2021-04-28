import { LineItem } from 'ordercloud-javascript-sdk'
import { FormEvent, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import useOcProduct from '../../hooks/useOcProduct'
import { removeLineItem, updateLineItem } from '../../redux/ocCurrentOrder'
import OcQuantityInput from '../OcQuantityInput'

interface OcLineItemCardProps {
  lineItem: LineItem
}

const OcLineItemCard: FunctionComponent<OcLineItemCardProps> = ({ lineItem }) => {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [quantity, setQuantity] = useState(lineItem.Quantity)

  const product = useOcProduct(lineItem.ProductID)

  const handleRemoveLineItem = useCallback(async () => {
    setDisabled(true)
    await dispatch(removeLineItem(lineItem.ID))
    setDisabled(false)
  }, [dispatch, lineItem])

  const handleUpdateLineItem = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setDisabled(true)
      await dispatch(updateLineItem({ ...lineItem, Quantity: quantity }))
      setDisabled(false)
    },
    [dispatch, quantity, lineItem]
  )

  const isUpdateDisabled = useMemo(() => {
    return disabled || lineItem.Quantity === quantity
  }, [lineItem, disabled, quantity])

  return (
    <div>
      <h2>{lineItem.Product.Name}</h2>

      <button
        aria-label="Remove Line Item"
        type="button"
        disabled={disabled}
        onClick={handleRemoveLineItem}
      >
        Remove
      </button>

      {product && (
        <form onSubmit={handleUpdateLineItem}>
          <OcQuantityInput
            controlId={`${lineItem.ID}_quantity`}
            quantity={quantity}
            disabled={disabled}
            onChange={setQuantity}
            priceSchedule={product.PriceSchedule}
          />
          <button type="submit" aria-label="Update Line Item Quantity" disabled={isUpdateDisabled}>
            Update
          </button>
        </form>
      )}
    </div>
  )
}

export default OcLineItemCard
