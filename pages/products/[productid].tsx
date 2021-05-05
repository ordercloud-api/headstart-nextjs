import Head from 'next/head'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import OcProductDetail from '../../ordercloud/components/OcProductDetail'
import { useOcSelector } from '../../ordercloud/redux/ocStore'

const ProductPage: FunctionComponent = () => {
  const { isReady, query, push } = useRouter()

  const productName = useOcSelector(
    (s) => s.ocProductDetail.product && s.ocProductDetail.product.Name
  )

  const handleLineItemUpdated = () => {
    push('/cart')
  }

  return (
    <>
      <Head>
        <title>{productName}</title>
      </Head>
      {isReady ? (
        <OcProductDetail
          onLineItemUpdated={handleLineItemUpdated}
          productId={query.productid as string}
          lineItemId={query.lineitem as string}
        />
      ) : (
        <h1>Loading</h1>
      )}
    </>
  )
}

export default ProductPage
