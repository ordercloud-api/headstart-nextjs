import { FunctionComponent, useMemo } from 'react'
import { useOcSelector } from '../../redux/ocStore'
import formatPrice from '../../utils/formatPrice'

const OcCheckoutSummary: FunctionComponent = () => {
  const { order, shipEstimateResponse, payments } = useOcSelector((s) => s.ocCurrentOrder)

  const isShippingAccurate = useMemo(() => {
    return (
      shipEstimateResponse &&
      shipEstimateResponse.ShipEstimates &&
      shipEstimateResponse.ShipEstimates.filter((se) => !se.SelectedShipMethodID).length === 0
    )
  }, [shipEstimateResponse])

  const isTaxAccurate = useMemo(() => {
    return order && order.BillingAddress && isShippingAccurate
  }, [order, isShippingAccurate])

  return order ? (
    <table>
      <tbody>
        <tr>
          <th>Subtotal</th>
          <td>{formatPrice(order.Subtotal)}</td>
        </tr>
        {order.PromotionDiscount ? (
          <tr>
            <th>Promotion</th>
            <td>{formatPrice(-order.PromotionDiscount)}</td>
          </tr>
        ) : null}
        <tr>
          <th>Shipping</th>
          <td>{isShippingAccurate ? formatPrice(order.ShippingCost) : '---'}</td>
        </tr>
        <tr>
          <th>Tax</th>
          <td>{isTaxAccurate ? formatPrice(order.TaxCost) : '---'}</td>
        </tr>
        <tr>
          <th>Total</th>
          <td>{formatPrice(order.Total)}</td>
        </tr>
        {payments &&
          payments.map((p) => (
            <tr key={p.ID}>
              <th>{`${p.Type} Payment`}</th>
              <td>{formatPrice(-p.Amount)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  ) : null
}

export default OcCheckoutSummary
