import { createSlice } from '@reduxjs/toolkit'
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
import { EMPTY_ADDRESS } from '../ocAddressBook'
import { createOcAsyncThunk } from '../ocReduxHelpers'

export interface RecentOrder {
  order: RequiredDeep<Order>
  lineItems: RequiredDeep<LineItem>[]
  payments: RequiredDeep<Payment>[]
}

export interface OcCurrentOrderState {
  initialized: boolean
  order?: RequiredDeep<Order>
  lineItems?: RequiredDeep<LineItem>[]
  payments?: RequiredDeep<Payment>[]
  shipEstimateResponse?: RequiredDeep<ShipEstimateResponse>
  recentOrders: RecentOrder[]
}

const initialState: OcCurrentOrderState = {
  initialized: false,
  recentOrders: [],
}

export const removeAllPayments = createOcAsyncThunk<undefined, undefined>(
  'ocCurrentOrder/removeAllPayments',
  async (paymentId, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const queue: Promise<any>[] = []
    if (ocCurrentOrder.payments) {
      ocCurrentOrder.payments.forEach((p) => {
        queue.push(Payments.Delete('Outgoing', ocCurrentOrder.order.ID, p.ID))
      })
    }
    await Promise.all(queue)
    return undefined
  }
)

export const retrievePayments = createOcAsyncThunk<RequiredDeep<Payment>[], string>(
  'ocCurrentOrder/retrievePayments',
  async (orderId, ThunkAPI) => {
    const response = await Payments.List('Outgoing', orderId, { pageSize: 100 })
    return response.Items
  }
)

export const retrieveOrder = createOcAsyncThunk<RequiredDeep<OrderWorksheet> | undefined, void>(
  'ocCurrentOrder/retrieveOrder',
  async (_, ThunkAPI) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortBy = 'DateCreated' as any // TODO: Not sure how to make this work better... might need a fix in the SDK
    const response = await Me.ListOrders({ sortBy, filters: { Status: 'Unsubmitted' } })
    const firstOrder = response.Items[0]
    if (firstOrder) {
      const worksheet = await IntegrationEvents.GetWorksheet('Outgoing', firstOrder.ID)
      if (
        worksheet.Order.BillingAddress &&
        worksheet.ShipEstimateResponse &&
        worksheet.ShipEstimateResponse.ShipEstimates &&
        worksheet.ShipEstimateResponse.ShipEstimates.length &&
        worksheet.ShipEstimateResponse.ShipEstimates.filter((se) => !se.SelectedShipMethodID)
          .length === 0
      ) {
        ThunkAPI.dispatch(retrievePayments(firstOrder.ID))
      }
      return worksheet
    }
    return undefined
  }
)

export const deleteCurrentOrder = createOcAsyncThunk<void, void>(
  'ocCurrentOrder/delete',
  async (_, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    if (ocCurrentOrder.order) {
      await Orders.Delete('Outgoing', ocCurrentOrder.order.ID)
    }
    // eslint-disable-next-line no-use-before-define
    ThunkAPI.dispatch(clearCurrentOrder())
    ThunkAPI.dispatch(retrieveOrder())
  }
)

export const transferAnonOrder = createOcAsyncThunk<void, string>(
  'ocCurrentOrder/transfer',
  async (anonUserToken, ThunkAPI) => {
    await Me.TransferAnonUserOrder({ anonUserToken })
    ThunkAPI.dispatch(retrieveOrder())
  }
)

export const createLineItem = createOcAsyncThunk<RequiredDeep<OrderWorksheet>, LineItem>(
  'ocCurrentOrder/createLineItem',
  async (request, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    let orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

    // initialize the order if it doesn't exist already
    if (!orderId) {
      const orderResponse = await Orders.Create('Outgoing', {})
      orderId = orderResponse.ID
    }

    // create the new line item
    await LineItems.Create('Outgoing', orderId, request)

    return IntegrationEvents.GetWorksheet('Outgoing', orderId)
  }
)

export const updateLineItem = createOcAsyncThunk<RequiredDeep<OrderWorksheet>, LineItem>(
  'ocCurrentOrder/updateLineItem',
  async (request, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

    // what to do when order doesn't exist? shouldn't happen.. but it could!
    // if (!orderId) {
    // }

    // save the line item
    await LineItems.Save('Outgoing', orderId, request.ID, request)

    return IntegrationEvents.GetWorksheet('Outgoing', orderId)
  }
)

export const removeLineItem = createOcAsyncThunk<RequiredDeep<OrderWorksheet>, string>(
  'ocCurrentOrder/removeLineItem',
  async (request, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

    // what to do when order doesn't exist? shouldn't happen.. but it could!
    // if (!orderId) {
    // }

    // save the line item
    await LineItems.Delete('Outgoing', orderId, request)

    return IntegrationEvents.GetWorksheet('Outgoing', orderId)
  }
)

export const saveShippingAddress = createOcAsyncThunk<
  RequiredDeep<OrderWorksheet>,
  Partial<BuyerAddress>
>('ocCurrentOrder/saveShippingAddress', async (request, ThunkAPI) => {
  const { ocCurrentOrder } = ThunkAPI.getState()
  const orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

  if (request) {
    if (request.ID) {
      await Orders.Patch('Outgoing', orderId, { ShippingAddressID: request.ID })
    } else {
      await Orders.SetShippingAddress('Outgoing', orderId, request as Address)
    }
  } else {
    await Orders.Patch('Outgoing', orderId, { ShippingAddressID: null })
  }

  return IntegrationEvents.GetWorksheet('Outgoing', orderId)
})

export const saveBillingAddress = createOcAsyncThunk<
  RequiredDeep<OrderWorksheet>,
  Partial<BuyerAddress>
>('ocCurrentOrder/saveBillingAddress', async (request, ThunkAPI) => {
  const { ocCurrentOrder } = ThunkAPI.getState()
  const orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

  // what to do when order doesn't exist? shouldn't happen.. but it could!
  // if (!orderId) {
  // }
  if (request.ID) {
    await Orders.Patch('Outgoing', orderId, { BillingAddressID: request.ID })
  } else {
    await Orders.SetBillingAddress('Outgoing', orderId, request as Address)
  }
  ThunkAPI.dispatch(removeAllPayments())

  return IntegrationEvents.Calculate('Outgoing', orderId)
})

export const removeBillingAddress = createOcAsyncThunk<RequiredDeep<OrderWorksheet>, undefined>(
  'ocCurrentOrder/removeBillingAddress',
  async (request, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const { order } = ocCurrentOrder

    // what to do when order doesn't exist? shouldn't happen.. but it could!
    // if (!orderId) {
    // }

    await Orders.Patch('Outgoing', order.ID, { BillingAddressID: null })
    ThunkAPI.dispatch(removeAllPayments())

    return IntegrationEvents.Calculate('Outgoing', order.ID)
  }
)

export const estimateShipping = createOcAsyncThunk<RequiredDeep<OrderWorksheet>, string>(
  'ocCurrentOrder/estimateShipping',
  async (orderId, ThunkAPI) => {
    const response = await IntegrationEvents.EstimateShipping('Outgoing', orderId)
    return response
  }
)

export const selectShipMethods = createOcAsyncThunk<
  RequiredDeep<OrderWorksheet>,
  RequiredDeep<ShipMethodSelection>[]
>('ocCurrentOrder/selectShipMethods', async (selection, ThunkAPI) => {
  const { ocCurrentOrder } = ThunkAPI.getState()
  const response = await IntegrationEvents.SelectShipmethods('Outgoing', ocCurrentOrder.order.ID, {
    ShipMethodSelections: selection,
  })
  ThunkAPI.dispatch(removeAllPayments())
  if (ocCurrentOrder.order.BillingAddress) {
    return IntegrationEvents.Calculate('Outgoing', ocCurrentOrder.order.ID)
  }
  return response
})

export const addPayment = createOcAsyncThunk<RequiredDeep<Payment>, Payment>(
  'ocCurrentOrder/addPayment',
  async (payment, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    return Payments.Create('Outgoing', ocCurrentOrder.order.ID, payment)
  }
)

export const removePayment = createOcAsyncThunk<string, string>(
  'ocCurrentOrder/removePayment',
  async (paymentId, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    await Payments.Delete('Outgoing', ocCurrentOrder.order.ID, paymentId)
    return paymentId
  }
)

export const submitOrder = createOcAsyncThunk<RecentOrder, any>(
  'ocCurrentOrder/submit',
  async (onSubmitted, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const submitResponse = await Orders.Submit('Outgoing', ocCurrentOrder.order.ID)
    // eslint-disable-next-line no-use-before-define
    ThunkAPI.dispatch(clearCurrentOrder())
    return {
      order: submitResponse,
      lineItems: ocCurrentOrder.lineItems,
      payments: ocCurrentOrder.payments,
    }
  }
)

const ocCurrentOrderSlice = createSlice({
  name: 'ocCurrentOrder',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.order = undefined
      state.lineItems = undefined
      state.shipEstimateResponse = undefined
      state.payments = undefined
      state.recentOrders = []
      state.initialized = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveOrder.pending, (state) => {
      state.initialized = true
    })
    builder.addCase(retrieveOrder.fulfilled, (state, action) => {
      if (action.payload) {
        state.order = action.payload.Order
        state.lineItems = action.payload.LineItems
        state.shipEstimateResponse = action.payload.ShipEstimateResponse
      }
    })
    builder.addCase(createLineItem.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(updateLineItem.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(removeLineItem.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(saveShippingAddress.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(saveBillingAddress.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(removeBillingAddress.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(estimateShipping.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(selectShipMethods.fulfilled, (state, action) => {
      state.order = action.payload.Order
      state.lineItems = action.payload.LineItems
      state.shipEstimateResponse = action.payload.ShipEstimateResponse
    })
    builder.addCase(retrievePayments.fulfilled, (state, action) => {
      state.payments = action.payload
    })
    builder.addCase(addPayment.fulfilled, (state, action) => {
      if (!state.payments) {
        state.payments = [action.payload]
      } else {
        state.payments.push(action.payload)
      }
    })
    builder.addCase(removePayment.fulfilled, (state, action) => {
      state.payments = state.payments.filter((p) => p.ID !== action.payload)
    })
    builder.addCase(removeAllPayments.fulfilled, (state, action) => {
      state.payments = []
    })
    builder.addCase(submitOrder.fulfilled, (state, action) => {
      state.recentOrders.unshift(action.payload)
      action.meta.arg(action.payload.order.ID)
    })
  },
})

export const { clearCurrentOrder } = ocCurrentOrderSlice.actions

export default ocCurrentOrderSlice.reducer
