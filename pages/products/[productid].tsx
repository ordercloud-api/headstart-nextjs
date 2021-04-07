import { useRouter } from "next/router"
import OcProductDetail from "../../components/OcProductDetail"

export default function ProductPage() {
    const { isReady, query } = useRouter()

    return isReady ? <OcProductDetail productId={query.productid as string}/> : <h1>Loading</h1>
}