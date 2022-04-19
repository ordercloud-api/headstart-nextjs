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
} from 'ordercloud-javascript-sdk';
import log from '../../utils/logs';
import generateUUID from '../../utils/generateUUID';

const orderDirection = 'Outgoing';

export const createOrder = (setOrder) => {
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

export const addLineItem = () => {
    log('trying to add line item', 'info');

    if (!orderId) {
        log('no order has been created', 'error');
        return;
    }

    LineItems.Create(orderDirection, orderId, { ProductID: 'break-bulk-3', Quantity: '1' }).then((response) => {
        //localStorage.setItem('order', JSON.stringify(response));
        log('line item added to order', 'success');
        log(response);
    }).catch((e) => {
        log(e, 'error');
    });
};

export const submitOrder = () => {
    log('submit order', 'info');
};

export const deleteOrder = () => {
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