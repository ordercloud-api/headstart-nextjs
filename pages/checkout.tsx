import { useRouter } from 'next/router'
import { FunctionComponent, useEffect } from 'react'
import OcCheckout from '../ordercloud/components/OcCheckout'
import { useOcSelector } from '../ordercloud/redux/ocStore'

const CheckoutPage: FunctionComponent = () => {
  const { push } = useRouter()
  const { order, initialized } = useOcSelector((s) => s.ocCurrentOrder)

  useEffect(() => {
    if (initialized && order && !order.LineItemCount) {
      push('/')
    }
  }, [order, initialized, push])

  return initialized ? <OcCheckout /> : null
}

export default CheckoutPage
