/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FunctionComponent, useState } from 'react'
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
  Products,
  Promotion,
} from 'ordercloud-javascript-sdk'
import OcProductDetail from '../../ordercloud/components/OcProductDetail'
import { useOcSelector } from '../../ordercloud/redux/ocStore'

const OrderPage: FunctionComponent = () => {
  const { isReady, query, push } = useRouter()

  console.log(isReady)
  console.log(query)
  console.log(push)

  const onFormSubmit = (e) => {
    e.preventDefault()

    IntegrationEvents.GetWorksheet('Outgoing', query.orderid.toString()).then((worksheet) => {
      const lineItemId = worksheet.LineItems[0].ID

      LineItems.Patch('Outgoing', query.orderid.toString(), lineItemId, {
        xp: {
          CargoWidth: parseInt(e.target.width.value),
          CargoHeight: parseInt(e.target.height.value),
          CargoLenght: parseInt(e.target.length.value),
          CargoWeight: parseInt(e.target.weight.value),
        },
      }).then((response) => {
        console.log(response)
        if (response.PromotionDiscount) {
          Orders.RemovePromotion('Outgoing', query.orderid.toString(), 'container-weighing').then(
            () => {
              Orders.AddPromotion('Outgoing', query.orderid.toString(), 'container-weighing')
            }
          )
        } else {
          Orders.AddPromotion('Outgoing', query.orderid.toString(), 'container-weighing')
        }
      })
    })
  }

  return (
    <div>
      <h1>Add details</h1>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor="port">Port of Loading/Departure</label>
          <input id="port" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <label htmlFor="vessel">Vessel/Service</label>
          <input id="vessel" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <label htmlFor="description">Goods description</label>
          <input id="description" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <label htmlFor="length">Add length</label>
          <input id="length" type="text" placeholder="Length" />
        </div>
        <div>
          <label htmlFor="height">Add height</label>
          <input id="height" type="text" placeholder="Height" />
        </div>
        <div>
          <label htmlFor="width">Add width</label>
          <input id="width" type="text" placeholder="Width" />
        </div>
        <div>
          <label htmlFor="weight">Add weight</label>
          <input id="weight" type="text" placeholder="Weight" />
        </div>

        <div>
          <label htmlFor="lifting">Lifting points</label>
          <input id="lifting" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <label htmlFor="location">Cargo location</label>
          <input id="location" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <label htmlFor="operation">Type of operation</label>
          <input id="operation" type="text" placeholder="Enter Details" />
        </div>
        <div>
          <p>Does it have a cradle?</p>
          <label>
            Yes
            <input type="radio" name="cradleHave" value="Yes" />
          </label>
          <label>
            No
            <input type="radio" name="cradleHave" value="No" />
          </label>
        </div>

        <div>
          <p>Does it need a cradle?</p>
          <label>
            Yes
            <input type="radio" name="cradleNeed" value="Yes" />
          </label>
          <label>
            No
            <input type="radio" name="cradleNeed" value="No" />
          </label>
        </div>

        <div>
          <p>Storage needed?</p>
          <label>
            Yes
            <input type="radio" name="storage" value="Yes" />
          </label>
          <label>
            No
            <input type="radio" name="storage" value="No" />
          </label>
        </div>

        <button type="submit">Add details</button>
      </form>
    </div>
    // <>
    //   <Head>
    //     <title>{productName}</title>
    //   </Head>
    //   {isReady ? (
    //     <OcProductDetail
    //       onLineItemUpdated={handleLineItemUpdated}
    //       productId={query.productid as string}
    //       lineItemId={query.lineitem as string}
    //     />
    //   ) : (
    //     <h1>Loading</h1>
    //   )}
    // </>
  )
}

export default OrderPage
