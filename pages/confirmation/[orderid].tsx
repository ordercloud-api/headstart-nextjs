import Head from 'next/head'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import OcOrderConfirmation from '../../ordercloud/components/OcOrderConfirmation'

const OrderConfirmationPage: FunctionComponent = () => {
  const { isReady, query } = useRouter()

  return (
    <>
      <Head>
        <title>Order Confirmed</title>
      </Head>
      {isReady ? <OcOrderConfirmation orderId={query.orderid as string} /> : <h1>Loading</h1>}
    </>
  )
}

export default OrderConfirmationPage
