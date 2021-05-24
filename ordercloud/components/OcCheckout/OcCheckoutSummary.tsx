import { FunctionComponent } from 'react'
import OcLineItemList from '../OcLineItemList'
import OcOrderSummary from '../OcOrderSummary'

const OcCheckoutSummary: FunctionComponent = () => {
  return (
    <div>
      <OcLineItemList />
      <OcOrderSummary />
    </div>
  )
}

export default OcCheckoutSummary
