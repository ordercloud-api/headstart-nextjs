export default (req, res) => {
  console.log('payload', req.body)
  res.status(200).send({
    ShipEstimates: [
      {
        ID: 'test',
        ShipEstimateItems: req.body.OrderWorksheet.LineItems.map((li) => ({
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
