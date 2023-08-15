import { NextApiHandler } from 'next'
import { OrderCalculateResponse, OrderWorksheet } from 'ordercloud-javascript-sdk'
import { withOcWebhookAuth } from '@ordercloud/catalyst'

// withOCWebhookAuth needs the raw body in order to validate the payload is coming from ordercloud
export const config = {
  api: {
    bodyParser: false,
  },
};

export type OrderCloudEnvironment = 'Production' | 'Staging' | 'Sandbox' | 'Qa'

export interface OrderCheckoutIntegrationEvent<T = null> {
  OrderWorksheet: OrderWorksheet
  Environment: OrderCloudEnvironment
  OrderCloudAccessToken: string
  ConfigData: T
}

const OrderCalculateHandler: NextApiHandler<OrderCalculateResponse> = (req, res) => {
  const event = req.body as OrderCheckoutIntegrationEvent

  return res.status(200).send({
    TaxTotal: event.OrderWorksheet.Order.BillingAddress ? 5 : 0,
  })
}

export default withOcWebhookAuth(OrderCalculateHandler)
