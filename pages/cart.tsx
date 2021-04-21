import { FunctionComponent } from 'react'
import OcLineItemList from '../ordercloud/components/OcLineItemList'
import { deleteCurrentOrder } from '../ordercloud/redux/ocCurrentOrder'
import { useOcDispatch } from '../ordercloud/redux/ocStore'

const CartPage: FunctionComponent = () => {
  const dispatch = useOcDispatch()

  return (
    <div>
      <button type="button" onClick={() => dispatch(deleteCurrentOrder())}>
        Clear Cart
      </button>
      <OcLineItemList />
    </div>
  )
}

export default CartPage
