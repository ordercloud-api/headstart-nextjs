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
import { useOcSelector } from '../../ordercloud/redux/ocStore'

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
    const storeToken = useOcSelector(store => store.ocAuth.decodedToken)
    const allProducts = useRef([])
    const requireDetailsProducts = useRef([])
    const readyToSendProducts = useRef([])
    const sentProducts = useRef([])
    //console.log(store.ocAuth.decodedToken)

    const getOrders = async () => {
        Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Open' } }).then((response) => {
            console.log(response.Items)

            response.Items.forEach(order => {
                Orders.Delete("Outgoing", order.ID)
            });
        })
    }

    const getProducts = () => {
        const token = Tokens.GetAccessToken()        
        const requests = []
        const openRequests = []

        if(token) {
            Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Open' } }).then((responseOpen) => {
                //console.log(responseOpen.Items)


                Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Unsubmitted' } }).then((responseUnsubmitted) => {
                    responseOpen.Items.forEach(order => {
                        requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                    });

                    responseUnsubmitted.Items.forEach(order => {
                        requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                    });

                    Promise.all(requests).then((worksheetsResponse) => {
                        console.log(worksheetsResponse)
                        const productRequests = []
    
                        worksheets.current = worksheetsResponse
    
                        worksheetsResponse.forEach((worksheet) => {
                            const productId = worksheet.LineItems[0].ProductID
    
                            productRequests.push(Me.GetProduct(productId))
                        })
    
                        Promise.all(productRequests).then((productsResponse) => {
                            console.log(productsResponse)
                            //requireDetailsProducts.current = productsResponse.filter(product => )
                            
                            allProducts.current = productsResponse
                            setProducts(productsResponse)
                        })
                    })
                })
            })
        }
    }

    const showAll  = () => {
        setProducts(allProducts.current)
    }

    const showRequireDetails  = () => {
        setProducts(requireDetailsProducts.current)
    }

    const showReadyToSend  = () => {
        setProducts(readyToSendProducts.current)
    }

    const showSent  = () => {
        setProducts(sentProducts.current)
    }

    useEffect(() => {
        getProducts()
    }, [storeToken])

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
            {/* <div>
                <p>
                    <button onClick={getOrders}>Delete orders</button>
                </p>
            </div> */}
            <div>
                <button type="button" onClick={showAll}>Show All</button>
                <button type="button" onClick={showRequireDetails}>Requires Details</button>
                <button type="button" onClick={showReadyToSend}>Ready to Send</button>
                <button type="button" onClick={showSent}>Sent Requests</button>
            </div>
            {products.length <= 0 && (
                <div>Loading...</div>
            )}
            <div>
                {products.map((product, i) => {
                    return (
                        <ProductCard product={product} worksheetId={worksheets.current[i]?.Order?.ID} isSubmitted={worksheets.current[i]?.Order.IsSubmitted} promotionDiscount={worksheets.current[i]?.LineItems[0]?.PromotionDiscount} key={`${product.ID}-${i}`} />
                    )
                })}
            </div>
        </div>
    )
}

export default AppointmentListingPage
