/* eslint-disable */
import Link from 'next/link'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { BuyerProduct } from 'ordercloud-javascript-sdk'
import OcLineItemList from '../../ordercloud/components/OcLineItemList'
import { deleteCurrentOrder } from '../../ordercloud/redux/ocCurrentOrder'
// import useOcProductList from '../hooks/useOcProductList'
import useOcProductList from '../../ordercloud/hooks/useOcProductList'
import { useOcDispatch } from '../../ordercloud/redux/ocStore'
import styles from './appointmentListing.module.css'
import ProductCard from './ProductCard'
import { useOcSelector } from '../../ordercloud/redux/ocStore'
import Loader from '../../components/Helpers/Loader'

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
    const [showLoader, setShowLoader] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const allOrders = useRef(0)
    const requireDetails = useRef(0)
    const readyToSend = useRef(0)
    const sentRequests = useRef(0)
    //console.log(store.ocAuth.decodedToken)

    const deleteOrers = async () => {
        Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Open' } }).then((response) => {
            console.log(response.Items)

            response.Items.forEach(order => {
                Orders.Delete("Outgoing", order.ID)
            });
        })
    }

    const resolvePromises = (requests) => {
        Promise.all(requests).then((worksheetsResponse) => {
            const productRequests = []

            worksheets.current = worksheetsResponse

            worksheetsResponse.forEach((worksheet: any) => {
                const productId = worksheet.LineItems[0].ProductID

                productRequests.push(Me.GetProduct(productId))
            })

            Promise.all(productRequests).then((productsResponse) => {
                setShowLoader(false)
                setProducts(productsResponse)
            })
        })
    }

    const getAllProducts = () => {
        const token = Tokens.GetAccessToken()
        const requests = []

        if (token) {
            setShowLoader(true)

            Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Open' } }).then((responseOpen) => {
                sentRequests.current = responseOpen.Items.length

                Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Unsubmitted' } }).then((responseUnsubmitted) => {
                    let requireDetailsCount = 0
                    let readyToSendCount = 0

                    responseOpen.Items.forEach(order => {
                        requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                    });

                    responseUnsubmitted.Items.forEach(order => {
                        if (order.PromotionDiscount === 0) {
                            requireDetailsCount += 1
                        } else {
                            readyToSendCount += 1
                        }

                        requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                    });

                    readyToSend.current = readyToSendCount
                    requireDetails.current = requireDetailsCount
                    allOrders.current = requests.length

                    resolvePromises(requests)
                })
            })
        }
    }

    const getRequireDetails = () => {
        const token = Tokens.GetAccessToken()
        const requests = []

        if (token) {
            setShowLoader(true)

            Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Unsubmitted' } }).then((responseUnsubmitted) => {
                const requireDetails = responseUnsubmitted.Items.filter((item) => item.PromotionDiscount === 0)

                requireDetails.forEach(order => {
                    requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                });

                resolvePromises(requests)
            })
        }
    }

    const getReadyToSend = () => {
        const token = Tokens.GetAccessToken()
        const requests = []

        if (token) {
            setShowLoader(true)

            Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Unsubmitted' } }).then((responseUnsubmitted) => {
                const requireDetails = responseUnsubmitted.Items.filter((item) => item.PromotionDiscount !== 0)

                requireDetails.forEach(order => {
                    requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                });

                resolvePromises(requests)
            })
        }
    }

    const getSent = () => {
        const token = Tokens.GetAccessToken()
        const requests = []

        if (token) {
            setShowLoader(true)

            Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: 'Open' } }).then((responseOpen) => {
                responseOpen.Items.forEach(order => {
                    requests.push(IntegrationEvents.GetWorksheet('Outgoing', order.ID))
                });

                resolvePromises(requests)
            })
        }
    }

    const showAll = () => {
        setActiveTab('all')
        getAllProducts()
    }

    const showRequireDetails = () => {
        setActiveTab('require')
        getRequireDetails()
    }

    const showReadyToSend = () => {
        setActiveTab('ready')
        getReadyToSend()
    }

    const showSent = () => {
        setActiveTab('sent')
        getSent()
    }

    useEffect(() => {
        getAllProducts()
    }, [storeToken])

    return (
        <div>
            <h1 className={styles.title}>Service Enquiries</h1>
            {/* <div>
                <p>
                    <button onClick={deleteOrers}>Delete orders</button>
                </p>
            </div> */}
            <ul className={styles.buttonList}>
                <li>
                    <button className={activeTab === 'all' ? styles.active : ''} type="button" onClick={showAll}>Showing All ({allOrders.current})</button>
                </li>
                <li>
                    <button className={activeTab === 'require' ? styles.active : ''} type="button" onClick={showRequireDetails}>Requires Details ({requireDetails.current})</button>
                </li>
                <li>
                    <button className={activeTab === 'ready' ? styles.active : ''} type="button" onClick={showReadyToSend}>Ready to Send ({readyToSend.current})</button>
                </li>
                <li>
                    <button className={activeTab === 'sent' ? styles.active : ''} type="button" onClick={showSent}>Sent Requests ({sentRequests.current})</button>
                </li>
            </ul>
            <div className={styles.results}>
                {showLoader && (
                    <div className={styles.loader}><Loader /></div>
                )}
                {!showLoader && (
                    <>
                        {products.map((product, i) => {
                            return (
                                <ProductCard product={product} worksheet={worksheets.current[i]} key={`${product.ID}-${i}`} />
                            )
                        })}
                    </>
                )}
            </div>
        </div>
    )
}

export default AppointmentListingPage
