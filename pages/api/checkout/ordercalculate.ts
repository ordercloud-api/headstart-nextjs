import { NextApiHandler, NextApiRequest } from 'next'
import { OrderCalculateResponse, OrderWorksheet } from 'ordercloud-javascript-sdk'
import withOcHashValidation from '../../../ordercloud/utils/withOcHashValidation'

export const config = {
  api: {
    bodyParser: false,
  },
}

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
    TaxTotal: 5,
  })
}

export default withOcHashValidation(OrderCalculateHandler)
