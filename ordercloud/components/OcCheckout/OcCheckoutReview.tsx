import { FunctionComponent, useCallback } from 'react'
import { OcCheckoutStepProps } from '.'
import { OcCurrentOrderState, submitOrder } from '../../redux/ocCurrentOrder'
import { useOcDispatch } from '../../redux/ocStore'
import OcLineItemList from '../OcLineItemList'
import OcCheckoutSummary from './OcCheckoutSummary'

interface OcCheckoutReviewProps extends OcCheckoutStepProps {
  onOrderSubmitted: (co: OcCurrentOrderState) => void
}

const OcCheckoutReview: FunctionComponent<OcCheckoutReviewProps> = ({
  onPrev,
  onOrderSubmitted,
}) => {
  const dispatch = useOcDispatch()
  const handleSubmitOrder = useCallback(async () => {
    await dispatch(submitOrder(onOrderSubmitted))
  }, [dispatch, onOrderSubmitted])

  return (
    <div>
      <h2>Review Order</h2>
      <OcLineItemList />
      <OcCheckoutSummary />
      <button type="button" onClick={onPrev}>
        Edit Payment
      </button>
      <button type="button" onClick={handleSubmitOrder}>
        Submit Order
      </button>
    </div>
  )
}

export default OcCheckoutReview
