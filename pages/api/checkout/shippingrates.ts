import { NextApiHandler } from 'next'
import { ShipEstimateResponse } from 'ordercloud-javascript-sdk'
import { OrderCheckoutIntegrationEvent } from './ordercalculate'
import { withOcWebhookAuth } from '@ordercloud/catalyst'

// withOCWebhookAuth needs the raw body in order to validate the payload is coming from ordercloud
export const config = {
  api: {
    bodyParser: false,
  },
};

const ShippingRatesHandler: NextApiHandler<ShipEstimateResponse> = (req, res) => {
  /**
   * OrderCloud API will pass the OrderWorksheet to the /shippingrates middleware
   * within the request body. Use this information to calculate shipment estimate groups.
   * In this example we are not using a third party shipping service. It assumes
   * all LineItems are in a single ShipEstimate, and the 3 different shipping options
   * are provided at a fixed rate.
   * */
  const event = req.body as OrderCheckoutIntegrationEvent

  res.status(200).send({
    ShipEstimates: [
      {
        ID: 'test',
        ShipEstimateItems: event.OrderWorksheet.LineItems.map((li) => ({
          LineItemID: li.ID,
          Quantity: li.Quantity,
        })),
        ShipMethods: [
          {
            ID: '1day',
            Name: 'Next Day Shipping',
            Cost: 50,
            EstimatedTransitDays: 1,
          },
          {
            ID: '2day',
            Name: 'Two Day Shipping',
            Cost: 25,
            EstimatedTransitDays: 2,
          },
          {
            ID: 'standard',
            Name: 'Standard Shipping',
            Cost: 12,
            EstimatedTransitDays: 5,
          },
        ],
      },
    ],
  })
}

export default withOcWebhookAuth(ShippingRatesHandler)
