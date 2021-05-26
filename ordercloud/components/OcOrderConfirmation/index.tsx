import { FunctionComponent } from 'react'
import { useOcSelector } from '../../redux/ocStore'

interface OcOrderConfirmationProps {
  orderId: string
}

const OcOrderConfirmation: FunctionComponent<OcOrderConfirmationProps> = ({ orderId }) => {
  const recentOrder = useOcSelector((s) =>
    s.ocCurrentOrder.recentOrders.find((ro) => ro.order.ID === orderId)
  )

  return (
    <div>
      <h2>Order Confirmation</h2>
      <pre>{JSON.stringify(recentOrder, null, 2)}</pre>
    </div>
  )
}

export default OcOrderConfirmation
