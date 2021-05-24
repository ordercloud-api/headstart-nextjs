import { BuyerAddress, IntegrationEvents } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { saveShippingAddress } from '../../redux/ocCurrentOrder'
import { useOcDispatch, useOcSelector } from '../../redux/ocStore'
import OcAddressBook from '../OcAddressBook'
import OcAddressForm from '../OcAddressForm'

const OcCheckoutShipping: FunctionComponent = () => {
  const dispatch = useOcDispatch()
  const { initialized, order, lineItems, user } = useOcSelector((s) => ({
    initialized: s.ocCurrentOrder.initialized,
    order: s.ocCurrentOrder.order,
    lineItems: s.ocCurrentOrder.lineItems,
    user: s.ocUser.user,
  }))

  const handleSetShippingAddress = (address: Partial<BuyerAddress>) => {
    dispatch(saveShippingAddress(address))
  }

  const currentShippingAddress = useMemo(() => {
    if (initialized && lineItems && lineItems.length) {
      return lineItems[0].ShippingAddress
    }
    return {}
  }, [initialized, lineItems])

  const estimateApplyAndCalculate = async (orderId) => {
    const estimateResponse = await IntegrationEvents.EstimateShipping('Outgoing', orderId)
    // await IntegrationEvents.SelectShipmethods('Outgoing', orderId, {
    //   ShipMethodSelections: [
    //     {
    //       ShipEstimateID: estimateResponse.ShipEstimateResponse.ShipEstimates[0].ID,
    //       ShipMethodID: 'standard',
    //     },
    //   ],
    // })
    // await IntegrationEvents.Calculate('Outgoing', orderId)
  }

  useEffect(() => {
    if (currentShippingAddress && order) {
      estimateApplyAndCalculate(order.ID)
    }
  }, [currentShippingAddress, order])

  const showAddressBook = useMemo(() => {
    return user && user.AvailableRoles && user.AvailableRoles.includes('MeAddressAdmin')
  }, [user])

  return initialized && order ? (
    <div>
      <h2>Shipping</h2>
      {showAddressBook ? (
        <OcAddressBook
          id="shipping"
          listOptions={{ pageSize: 100 }}
          selected={order.ShippingAddressID}
          onChange={handleSetShippingAddress}
        />
      ) : (
        <OcAddressForm
          id="shipping"
          address={currentShippingAddress}
          onSubmit={handleSetShippingAddress}
        />
      )}
    </div>
  ) : null
}

export default OcCheckoutShipping
