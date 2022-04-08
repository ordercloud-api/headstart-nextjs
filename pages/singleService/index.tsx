/* eslint-disable */
import Link from 'next/link'
import { FunctionComponent, useEffect, useState } from 'react'
import { BuyerProduct } from 'ordercloud-javascript-sdk'
import OcLineItemList from '../../ordercloud/components/OcLineItemList'
import { deleteCurrentOrder } from '../../ordercloud/redux/ocCurrentOrder'
// import useOcProductList from '../hooks/useOcProductList'
import useOcProductList from '../../ordercloud/hooks/useOcProductList'
import { useOcDispatch } from '../../ordercloud/redux/ocStore'
import styles from './SingleService.module.css'

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
} from 'ordercloud-javascript-sdk'

export interface OcProductListProps {
  options?: OcProductListOptions
  renderItem?: (product: BuyerProduct) => JSX.Element
}


function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const SingleServicePage: FunctionComponent<OcProductListProps> = ( { options }) => {
  // const options = { filters: {} }
  // const options2 = {
  //   filters: {
  //     'xp.color': undefined,
  //     'xp.size': undefined,
  //     'xp.test_boolean': undefined,
  //     'xp.test_number': undefined,
  //   },
  //   page: undefined,
  //   pageSize: undefined,
  //   search: undefined,
  //   searchOn: undefined,
  //   sortBy: undefined,
  // }
  const firstOrederId = generateUUID()
  const [rows, setRows] = useState([{ orderId: firstOrederId }])
  const [ordersLineItems, setOrdersLineItems] = useState({})

  const dispatch = useOcDispatch()

  const products = useOcProductList(options)
  // console.log(products);

  const onLineItemChange = (e) => {
    const { orderId } = e.currentTarget.dataset
    const { valueType } = e.currentTarget.dataset
    const newOrdersLineItems = { ...ordersLineItems }

    if (typeof newOrdersLineItems[orderId] === 'undefined') {
      newOrdersLineItems[orderId] = {}
    }

    newOrdersLineItems[orderId][valueType] = e.currentTarget.value

    setOrdersLineItems(newOrdersLineItems)
  }

  const addRow = () => {
    const newRows = [...rows]

    newRows.push({
      orderId: generateUUID(),
    })

    setRows(newRows)
  }

  const getOrders = async () => {
    await Orders.List("Outgoing")
    //await Orders.List("Outgoing")
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const orders = []

    for (const [orderId, value] of Object.entries(ordersLineItems)) {
      const valueType:any = value;
      await Orders.Create("Outgoing", { ID: orderId }).then(() => {
        LineItems.Create("Outgoing", orderId, {
          ProductID: valueType.lineItemId,
          Quantity: valueType.quantity
        }).then((order) => {
          //IntegrationEvents.GetWorksheet('Outgoing', orderId)
          // Orders.Save("Outgoing", orderId, order).then(() => {
          //   getOrders()
          // })
        })
      })
      orders.push(orderId)
      console.log(orderId)
      console.log(value)
    }

    window.localStorage.setItem("orders", JSON.stringify(orders))

    // for (const [key, value] of Object.entries(ordersLineItems)) {
    //   await Orders.Save("Outgoing", key, order)
    //   console.log(key)
    //   console.log(value)
    // }
    // fetch("https://sandboxapi.ordercloud.io/v1/orders/Outgoing", {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data)
    // })

    

    // fetch("https://sandboxapi.ordercloud.io/v1/orders/Outgoing")
    // .then(response => response.json())
    // .then((data) => {
    //   console.log(data)
    // })
  }

  if (!products) {
    return null
  }

  return (
    <div>
      {/* <button type="button" onClick={() => dispatch(deleteCurrentOrder())}>
        Clear Cart
      </button>
      <OcLineItemList emptyMessage="Your shopping cart is empty" editable />
      <Link href="/checkout">
        <a>asd</a>
      </Link> */}
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
      <div className={styles.request}>
        <h2>Request a service</h2>
        <div>Select service - &gt; Provide details - &gt; Send request</div>
        <form onSubmit={onFormSubmit}>
          {rows.map((row, i) => {
            return (
              <div key={row.orderId} className={styles.row}>
                <div className={styles.selectWrapper}>
                  <label htmlFor="services">Services</label>
                  <select
                    id="services"
                    data-order-id={row.orderId}
                    data-value-type="lineItemId"
                    onChange={onLineItemChange}
                  >
                    <option>Please select</option>
                    {products.map((product) => {
                      return (
                        <option key={product.ID} data-id={product.ID} value={product.ID}>
                          {product.Name}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className={styles.quantityWrapper}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    data-order-id={row.orderId}
                    data-value-type="quantity"
                    onChange={onLineItemChange}
                  />
                </div>
              </div>
            )
          })}
          <button className={styles.add} type="button" onClick={addRow}>
            Add another service
          </button>
          <div>
            <button className={styles.submit} type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SingleServicePage
