import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import OcProductDetail from '../../ordercloud/components/OcProductDetail'
import { useOcSelector } from '../../ordercloud/redux/ocStore'
import {
  createOrder,
  addLineItem,
  submitOrder,
  deleteOrder
} from './events';


const TestPage = () => {
  const [order, setOrder] = useState({});

  return (
    <>
      <h1>Test OC APIs</h1>
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div>
            <h2>Order creation</h2>
            <button className='btn' onClick={createOrder}>Create Order</button>
            <button className='btn' onClick={addLineItem}>Add Line item</button>
            <button className='btn' onClick={submitOrder}>Submit Order</button>
          </div>
          <div>
            <h2>Order deletion</h2>
            <button className='btn' onClick={deleteOrder}>Delete Order</button>
          </div>
        </div>
        <aside style={{ minWidth: "30%", position: "sticky", background: "white" }}>
          <h3>Order</h3>
          <pre>
            <code>{JSON.stringify(order, null, 2)}</code>
          </pre>
        </aside>
      </section>
    </>
  )
}

export default TestPage;