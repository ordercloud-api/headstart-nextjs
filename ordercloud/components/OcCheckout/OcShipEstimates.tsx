import { RequiredDeep, ShipEstimate, ShipMethodSelection } from 'ordercloud-javascript-sdk'
import { ChangeEvent, FunctionComponent, useCallback, useEffect, useMemo } from 'react'
import { estimateShipping, selectShipMethods } from '../../redux/ocCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'
import formatPrice from '../../utils/formatPrice'

const useOcCheckoutShipping = () =>
  useOcSelector((s) => {
    const { initialized, lineItems, order, shipEstimateResponse } = s.ocCurrentOrder
    const ready = initialized && order && lineItems && lineItems.length
    return {
      orderId: ready ? order.ID : undefined,
      shippingAddress: ready ? lineItems[0].ShippingAddress : undefined,
      shipEstimateResponse,
    }
  })

interface OcShipMethodSelectorProps {
  estimate: RequiredDeep<ShipEstimate>
  selected: string | null
  onChange: (selection: RequiredDeep<ShipMethodSelection>) => void
}

const OcShipMethodSelector: FunctionComponent<OcShipMethodSelectorProps> = ({
  estimate,
  selected,
  onChange,
}) => {
  const handleSelectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ShipEstimateID: estimate.ID, ShipMethodID: e.target.value })
  }
  return (
    <div>
      {estimate.ShipMethods.map((method) => (
        <label key={method.ID} htmlFor={`estimate_${estimate.ID}_method_${method.ID}`}>
          <input
            id={`estimate_${estimate.ID}_method_${method.ID}`}
            name={`estimate_${estimate.ID}`}
            type="radio"
            checked={method.ID === selected}
            onChange={handleSelectionChange}
            value={method.ID}
          />{' '}
          {`${formatPrice(method.Cost)} ${method.Name}`}
          <small>{` (${method.EstimatedTransitDays} transit ${
            method.EstimatedTransitDays === 1 ? 'day' : 'days'
          })`}</small>
        </label>
      ))}
    </div>
  )
}

const OcShipEstimates: FunctionComponent = () => {
  const dispatch = useOcDispatch()
  const { orderId, shippingAddress, shipEstimateResponse } = useOcCheckoutShipping()

  useEffect(() => {
    if (orderId && shippingAddress && !shipEstimateResponse) {
      dispatch(estimateShipping(orderId))
    }
  }, [dispatch, orderId, shippingAddress, shipEstimateResponse])

  const handleShipMethodSelectionChange = (selection: RequiredDeep<ShipMethodSelection>) => {
    dispatch(selectShipMethods([selection]))
  }

  return shipEstimateResponse &&
    shipEstimateResponse.ShipEstimates &&
    shipEstimateResponse.ShipEstimates.length ? (
    <div>
      {shipEstimateResponse.ShipEstimates.map((estimate) => (
        <OcShipMethodSelector
          key={estimate.ID}
          estimate={estimate}
          selected={estimate.SelectedShipMethodID}
          onChange={handleShipMethodSelectionChange}
        />
      ))}
    </div>
  ) : null
}

export default OcShipEstimates
