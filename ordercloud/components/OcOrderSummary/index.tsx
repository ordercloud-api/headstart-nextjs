import { FunctionComponent } from 'react'
import { useOcSelector } from '../../redux/ocStore'
import formatPrice from '../../utils/formatPrice'

const OcOrderSummary: FunctionComponent = () => {
  const { order } = useOcSelector((s) => s.ocCurrentOrder)

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
          <td>{formatPrice(order.ShippingCost)}</td>
        </tr>
        <tr>
          <th>Tax</th>
          <td>{formatPrice(order.TaxCost)}</td>
        </tr>
        <tr>
          <th>Total</th>
          <td>{formatPrice(order.Total)}</td>
        </tr>
      </tbody>
    </table>
  ) : null
}

export default OcOrderSummary
