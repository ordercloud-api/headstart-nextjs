import { LineItem } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import { removeLineItem } from '../../redux/ocCurrentOrder'
import OcProductCard from '../OcProductCard'

interface OcLineItemCardProps {
  lineItem: LineItem
}

const OcLineItemCard: FunctionComponent<OcLineItemCardProps> = ({ lineItem }) => {
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)

  const handleRemoveLineItem = useCallback(async () => {
    setDisabled(true)
    await dispatch(removeLineItem(lineItem.ID))
    setDisabled(false)
  }, [dispatch, lineItem])

  return (
    <div>
      <OcProductCard product={lineItem.Product} />

      {/**
       * TODO: Will probably need to wait to figure out product caching to make this
       * work efficiently. Forgot price schedule isn't on line item product
       * <OcQuantityInput priceSchedule={lineItem.Product}></OcQuantityInput>
       * */}
      <button
        aria-label="Remove Line Item"
        type="button"
        disabled={disabled}
        onClick={handleRemoveLineItem}
      >
        Remove
      </button>
    </div>
  )
}

const OcLineItemList: FunctionComponent = () => {
  const { lineItems } = useOcCurrentOrder()

  return (
    <ol>
      {lineItems &&
        lineItems.map((li) => (
          <li key={li.ID}>
            <OcLineItemCard lineItem={li} />
          </li>
        ))}
    </ol>
  )
}

export default OcLineItemList
