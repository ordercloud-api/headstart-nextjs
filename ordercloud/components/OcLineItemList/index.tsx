import { FunctionComponent } from 'react'
import useOcCurrentOrder from '../../hooks/useOcCurrentOrder'
import OcLineItemCard from '../OcLineItemCard'

interface OcLineItemListProps {
  emptyMessage?: string
  editable?: boolean
}

const OcLineItemList: FunctionComponent<OcLineItemListProps> = ({ emptyMessage, editable }) => {
  const { lineItems } = useOcCurrentOrder()

  return lineItems && lineItems.length ? (
    <ol>
      {lineItems.map((li) => (
        <li key={li.ID}>
          <OcLineItemCard lineItem={li} editable={editable} />
        </li>
      ))}
    </ol>
  ) : (
    <h3>{emptyMessage}</h3>
  )
}

export default OcLineItemList
