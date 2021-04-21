import { FunctionComponent } from 'react'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'

const OcLineItemList: FunctionComponent = () => {
  const { lineItems } = useOcCurrentOrder()

  return (
    <ol>
      {lineItems &&
        lineItems.map((li) => (
          <li key={li.ID}>
            <pre>{JSON.stringify(li, null, 2)}</pre>
          </li>
        ))}
    </ol>
  )
}

export default OcLineItemList
