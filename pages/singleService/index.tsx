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
import { useRouter } from 'next/router'

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
import router from 'next/router'

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
  const router = useRouter()
  const firstOrederId = generateUUID()
  const [rows, setRows] = useState([{ orderId: firstOrederId }])
  const [ordersLineItems, setOrdersLineItems] = useState({})
  const products = useOcProductList(options)

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


  const onFormSubmit = async (e) => {
    e.preventDefault()
    const orders = []

    for (const [orderId, value] of Object.entries(ordersLineItems)) {
      const valueType:any = value;
      await Orders.Create("Outgoing", { ID: orderId }).then(() => {
        LineItems.Create("Outgoing", orderId, {
          ProductID: valueType.lineItemId,
          Quantity: 1
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

    router.push("/appointmentListing")
  }

  if (!products) {
    return null
  }

  return (
    <>
    <div className={styles.hero__wrapper}>
      <img src="/sshero.png" alt="" className={styles.hero} />
    </div>

    <div className={styles.single_service}>
      <div className={styles.content__wrapper}>
          <div className={styles.content}>
            <div className={styles.title__striped}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.6 116.7" width="447.6" height="116.7"><path d="M89 42.8v-8.3l62.4-28.6v11zM23.1 53.2V59l96.8-48.6V0zM0 79.6l53.4-22.1v-6.7L0 75.2z" fill="#FF6441"></path></svg>
              </div>
              <h1>Container Weighing (VGM)</h1>
            </div>
            <button className='button button--small'>Request a service</button>
            <p>
              The following frequently asked questions regarding trucking requirements and the draying of containers. All links are live and will assist you in addressing your current needs.
            </p>
            <p>
              APM Terminals are dedicated to providing you with the best customer service. Should you have any questions or concerns please call our staff at (310) 221-4100 for assistance.
            </p>

            <h2 className={styles.content__heading_break}>About VGM</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Tempus egestas sed sed risus pretium quam vulputate dignissim. Vel turpis nunc eget lorem dolor sed viverra ipsum. At volutpat diam ut venenatis tellus in metus vulputate. Sed libero enim sed faucibus turpis. Dignissim suspendisse in est ante in nibh mauris cursus. Scelerisque eleifend donec pretium vulputate sapien nec. Cursus vitae congue mauris rhoncus aenean vel. Vitae semper quis lectus nulla at volutpat. Ut pharetra sit amet aliquam id diam maecenas.
            </p>
            <p>
              Ullamcorper morbi tincidunt ornare massa eget egestas purus. Commodo elit at imperdiet dui accumsan. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Pretium nibh ipsum consequat nisl vel. Quis lectus nulla at volutpat diam. Imperdiet dui accumsan sit amet nulla facilisi. Diam maecenas ultricies mi eget mauris pharetra. Neque sodales ut etiam sit amet nisl purus in. A condimentum vitae sapien pellentesque habitant. Nulla posuere sollicitudin aliquam ultrices sagittis orci a. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Cursus vitae congue mauris rhoncus. At lectus urna duis convallis convallis.
            </p>
          </div>

          <div className={styles.content__side}>
            <div className={styles.card}>
              <h4>Terminal Tariffs</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidiut ut labore
                et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum consectetur libero
              </p>
              <div className={styles.download__button_wrapper}>
                <div className={styles.download__button}>
                  <img src="/dlbtn_on.svg" alt=""/>
                  <img src="/dlbtn_off.svg" alt=""/>
                </div>
                <span className={styles.download__button_text}>Download 2022 tariffs</span>
              </div>
            </div>

            <div className={styles.card}>
              <h4>Contact Terminal</h4>
              <p>
                Ullamcorper morbi tincidunt ornare massa eget egestas purus. Commodo elit at imperdiet dui accumsan
              </p>
              <div className={styles.download__button_wrapper}>
                <div className={styles.download__button}>
                  <img src="/dlbtn_on.svg" alt=""/>
                  <img src="/dlbtn_off.svg" alt=""/>
                </div>
                <span className={styles.download__button_text}>Download 2022 tariffs</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.request__container}>
        <div className={styles.request}>
          <h2 className={styles.request_title}>Request a service</h2>
          <div className={styles.stepper}>
            <img src="/right_arrow.svg" alt="" className={styles.stepper_rightarrow}/>
            <span>Select service</span>
            <div className={styles.stepper_spacer}></div>
            <div className={styles.stepper_dot}></div>
            <span>Provide details</span>
            <div className={styles.stepper_spacer}></div>
            <div className={styles.stepper_dot}></div>
            <span>Send request</span>
          </div>
          <form onSubmit={onFormSubmit} className={styles.request_form}>
            {rows.map((row, i) => {
              return (
                  <div key={row.orderId} className={styles.selectWrapper}>
                    {i === 0 && <label htmlFor="services">Services</label>}
                    <select
                      id="services"
                      className={styles.request_select}
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
              )
            })}
            <div className={styles.stepper_button_wrapper}>
              <button className='button button--small' type="button" onClick={addRow}>Add another service</button>
            </div>
            <div className={styles.stepper_button_wrapper}>
              <button className='button button--small' type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>

    </div>
    </>
  )
}

export default SingleServicePage
