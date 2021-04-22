import { FunctionComponent } from 'react'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import OcLineItemCard from '../OcLineItemCard'

const OcLineItemList: FunctionComponent = () => {
  const { lineItems } = useOcCurrentOrder()

  return (
    <ol>
      {lineItems &&
        lineItems.map((li) => (
          <li key={li.ID}>
            <OcLineItemCard lineItem={li} />
          </li>
        ))}
    </ol>
  )
}

export default OcLineItemList
