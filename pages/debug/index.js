import { useState } from 'react';
import { LineItems, Orders } from 'ordercloud-javascript-sdk';
import log from '../../utils/logs';
import generateUUID from '../../utils/generateUUID';

const TestPage = () => {
  const [order, setOrder] = useState({});
  const orderDirection = 'Outgoing';

  const createOrder = () => {
    const orderId = generateUUID();

    Orders.Create(orderDirection, { ID: orderId }).then((response) => {
      localStorage.setItem('order', JSON.stringify(response));
      setOrder(response);

      log(`order ${response.ID} created`, 'success');
      log(response);
    }).catch((e) => {
      log(e, 'error');
    });
  };

  const addLineItem = () => {
    log('trying to add line item', 'info');

    if (!order || !order.ID) {
      log('no order has been created', 'error');
      return;
    }

    LineItems.Create(orderDirection, order.ID, { ProductID: 'break-bulk-3', Quantity: '1' }).then((response) => {
      //localStorage.setItem('order', JSON.stringify(response));
      log('line item added to order', 'success');
      log(response);
    }).catch((e) => {
      log(e, 'error');
    });
  };

  const submitOrder = () => {
    log('submit order', 'info');
  };

  const deleteOrder = () => {
    const storedOrder = JSON.parse(localStorage.getItem('order'));

    if (!storedOrder || !storedOrder.ID) {
      log('no order available to delete', 'error');
      return;
    }

    Orders.Delete(orderDirection, storedOrder.ID).then((response) => {
      log(`order ${response.ID} deleted`, 'success');

      localStorage.clear('order');
    }).catch((e) => {
      log(e, 'error');
    });
  }

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
        <aside style={{ minWidth: "30%" }}>
          <h3>Order</h3>
          <pre>
            <code>{JSON.stringify(order, null, 2)}</code>
          </pre>
        </aside>
      </section>
    </>
  )
};

export default TestPage;