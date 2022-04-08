/* eslint-disable */
import Link from 'next/link'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { BuyerProduct } from 'ordercloud-javascript-sdk'
import OcLineItemList from '../../ordercloud/components/OcLineItemList'
import { deleteCurrentOrder } from '../../ordercloud/redux/ocCurrentOrder'
// import useOcProductList from '../hooks/useOcProductList'
import useOcProductList from '../../ordercloud/hooks/useOcProductList'
import { useOcDispatch } from '../../ordercloud/redux/ocStore'
import styles from './SingleService.module.css'
import ProductCard from './ProductCard'

import { OcProductListOptions } from '../../ordercloud/redux/ocProductList'
import {
    BuyerAddress,
    Address,
    LineItem,
    LineItems,
    Me,
    Order,
    Orders,
    ShipEstimateResponse,
    IntegrationEvents,
    RequiredDeep,
    ShipMethodSelection,
    OrderWorksheet,
    Payment,
    Payments,
    Auth,
    ApiRole,
    Tokens,
    Product,
    Products
} from 'ordercloud-javascript-sdk'

export interface OcProductListProps {
    options?: OcProductListOptions
    renderItem?: (product: BuyerProduct) => JSX.Element
}


const AppointmentListingPage: FunctionComponent<OcProductListProps> = () => {
    const [products, setProducts] = useState([])
    const worksheets = useRef([])

    const getOrders = async () => {
        getProducts()
    }

    const getProducts = () => {
        const token = Tokens.GetAccessToken()
        const orders = JSON.parse(window.localStorage.getItem("orders"));
        
        const requests = []

        if(token) {
            orders.forEach(orderId => {
                requests.push(IntegrationEvents.GetWorksheet('Outgoing', orderId))                
            });

            Promise.all(requests).then((worksheetsResponse) => {
                const productRequests = []
                console.log(worksheetsResponse)

                worksheets.current = worksheetsResponse

                worksheetsResponse.forEach((worksheet) => {
                    const productId = worksheet.LineItems[0].ProductID

                    productRequests.push(Me.GetProduct(productId))
                })

                Promise.all(productRequests).then((productsResponse) => {
                    console.log(productsResponse)
                    setProducts(productsResponse)
                })
            })
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div>
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum
                    consectetur libero. Tempus egestas sed sed risus pretium quam vulputate dignissim. Vel
                    turpis nunc eget lorem dolor sed viverra ipsum. At volutpat diam ut venenatis tellus in
                    metus vulputate. Sed libero enim sed faucibus turpis. Dignissim suspendisse in est ante in
                    nibh mauris cursus. Scelerisque eleifend donec pretium vulputate sapien nec. Cursus vitae
                    congue mauris rhoncus aenean vel. Vitae semper quis lectus nulla at volutpat. Ut pharetra
                    sit amet aliquam id diam maecenas.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum
                    consectetur libero. Tempus egestas sed sed risus pretium quam vulputate dignissim. Vel
                    turpis nunc eget lorem dolor sed viverra ipsum. At volutpat diam ut venenatis tellus in
                    metus vulputate. Sed libero enim sed faucibus turpis. Dignissim suspendisse in est ante in
                    nibh mauris cursus. Scelerisque eleifend donec pretium vulputate sapien nec. Cursus vitae
                    congue mauris rhoncus aenean vel. Vitae semper quis lectus nulla at volutpat. Ut pharetra
                    sit amet aliquam id diam maecenas.
                </p>
            </div>
            <div>
                <p>
                    <button onClick={getOrders}>Get orders</button>
                </p>
            </div>
            <div>
                {products.map((product, i) => {
                    console.log(`${product.ID}-${i}`)
                    return (
                        <ProductCard product={product} worksheetId={worksheets.current[i]?.Order?.ID} promotionDiscount={worksheets.current[i]?.LineItems[0]?.PromotionDiscount} key={`${product.ID}-${i}`} />
                    )
                })}
            </div>
        </div>
    )
}

export default AppointmentListingPage
