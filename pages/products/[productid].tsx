import Head from "next/head"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import OcProductDetail from "../../ordercloud/components/OcProductDetail"
import { OcRootState } from "../../ordercloud/redux/ocStore"

export default function ProductPage() {
    const { isReady, query } = useRouter()

    const productName = useSelector((state:OcRootState) => state.ocProductDetail.product && state.ocProductDetail.product.Name)

    return <>
        <Head>
            <title>{productName}</title>
        </Head>
        {isReady ? <OcProductDetail productId={query.productid as string}/> : <h1>Loading</h1>}
    </>
}