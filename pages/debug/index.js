import { useState } from 'react';
import { LineItems, Orders, Me } from 'ordercloud-javascript-sdk';
import log from '../../utils/logs';
import generateUUID from '../../utils/generateUUID';

const TestPage = () => {
  const [order, setOrder] = useState({});
  const [apiResponse, setResponse] = useState({});
  const orderDirection = 'Outgoing';

  const createOrder = () => {
    const orderId = generateUUID();

    Orders.Create(orderDirection, { ID: orderId }).then((response) => {
      localStorage.setItem('order', JSON.stringify(response));
      setOrder(response);

      log(`order ${response.ID} created`, 'success');
      log(response);
      setResponse(response);
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

    LineItems.Create(orderDirection, order.ID, { ProductID: 'break-bulk', Quantity: '1' }).then((response) => {
      //localStorage.setItem('order', JSON.stringify(response));
      log('line item added to order', 'success');
      log(response);
      setResponse(response);
    }).catch((e) => {
      log(e, 'error');
    });
  };

  const submitOrder = () => {
    log('TODO submit order. Not working currently', 'error');
  };

  const deleteOrder = () => {
    const storedOrder = JSON.parse(localStorage.getItem('order'));

    if (!storedOrder || !storedOrder.ID) {
      log('no order available to delete', 'error');
      return;
    }

    Orders.Delete(orderDirection, storedOrder.ID).then((response) => {
      log(`order ${response.ID} deleted`, 'success');
      setResponse(response);
      localStorage.clear('order');
    }).catch((e) => {
      log(e, 'error');
    });
  };

  const deleteOrders = (e) => {
    const status = e.currentTarget.dataset.status;

    Me.ListOrders({ sortBy: ['!LastUpdated'], filters: { Status: status } }).then((response) => {
      console.log(response.Items)

      response.Items.forEach(order => {
        Orders.Delete("Outgoing", order.ID)
      });
    })
  };

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
          <div>
            <h2>Delete all orders</h2>
            <button className='btn' onClick={deleteOrders} data-status="Open">Delete "Open" orders</button>
            <button className='btn' onClick={deleteOrders} data-status="Unsubmitted">Delete "Unsubmitted" orders</button>
          </div>
        </div>
        <aside style={{ minWidth: "40%", maxWidth: "30%", overflowX: "auto" }}>
          <h3>Order</h3>
          <pre>
            <code>{JSON.stringify(apiResponse, null, 2)}</code>
          </pre>
        </aside>
      </section>
    </>
  )
};

export default TestPage;