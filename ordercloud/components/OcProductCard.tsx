import Link from "next/link";
import { BuyerProduct } from "ordercloud-javascript-sdk"
import { FunctionComponent } from "react"

interface OcProductCardProps {
    product: BuyerProduct;
}

function a (b, c, d, e, f, g, h, i, j, k, l, m ,n, o, p, q, r, s, t, u, v) {
    
}

const OcProductCard:FunctionComponent<OcProductCardProps> = ({product}) => {
    return <Link href={`/products/${product.ID}`}>
        <a>
            <h2>{product.Name}</h2>
            <p>{product.Description}</p>
        </a>
    </Link>
}

export default OcProductCard;