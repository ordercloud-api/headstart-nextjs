import { createSlice } from '@reduxjs/toolkit'
import { LineItem, LineItems, Me, Order, Orders } from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk } from '../ocReduxHelpers'

export interface OcCurrentOrderState {
  initialized: boolean
  order?: Order
  lineItems?: LineItem[]
}

const initialState: OcCurrentOrderState = {
  initialized: false,
}

export const retrieveLineItems = createOcAsyncThunk<LineItem[], string>(
  'ocCurrentOrder/retrieveLineItems',
  async (orderId) => {
    const response = await LineItems.List('Outgoing', orderId, { pageSize: 100 })
    return response.Items
  }
)

export const retrieveOrder = createOcAsyncThunk<Order | undefined, void>(
  'ocCurrentOrder/retrieveOrder',
  async (_, ThunkAPI) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortBy = 'DateCreated' as any // TODO: Not sure how to make this work better... might need a fix in the SDK
    const response = await Me.ListOrders({ sortBy, filters: { Status: 'Unsubmitted' } })
    if (response.Items[0] && response.Items[0].LineItemCount > 0) {
      ThunkAPI.dispatch(retrieveLineItems(response.Items[0].ID))
    }
    return response.Items[0]
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

export const createLineItem = createOcAsyncThunk<{ order: Order; lineItem: LineItem }, LineItem>(
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
    const lineItem = await LineItems.Create('Outgoing', orderId, request)

    // get the updated order (totals, lineItemCount, dateLastUpdated, etc...)
    const updatedOrder = await Orders.Get('Outgoing', orderId)

    return {
      order: updatedOrder,
      lineItem,
    }
  }
)

export const updateLineItem = createOcAsyncThunk<{ order: Order; lineItem: LineItem }, LineItem>(
  'ocCurrentOrder/updateLineItem',
  async (request, ThunkAPI) => {
    const { ocCurrentOrder } = ThunkAPI.getState()
    const orderId = ocCurrentOrder.order ? ocCurrentOrder.order.ID : undefined

    // what to do when order doesn't exist? shouldn't happen.. but it could!
    // if (!orderId) {
    // }

    // save the line item
    const lineItem = await LineItems.Save('Outgoing', orderId, request.ID, request)

    // get the updated order (totals, lineItemCount, dateLastUpdated, etc...)
    const updatedOrder = await Orders.Get('Outgoing', orderId)

    return {
      order: updatedOrder,
      lineItem,
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveOrder.pending, (state) => {
      state.initialized = true
    })
    builder.addCase(retrieveOrder.fulfilled, (state, action) => {
      state.order = action.payload
    })
    builder.addCase(retrieveLineItems.fulfilled, (state, action) => {
      state.lineItems = action.payload
    })
    builder.addCase(createLineItem.fulfilled, (state, action) => {
      state.lineItems = [...(state.lineItems || []), action.payload.lineItem]
      state.order = action.payload.order
    })
    builder.addCase(updateLineItem.fulfilled, (state, action) => {
      state.lineItems = state.lineItems.splice(
        state.lineItems.findIndex((li) => li.ID === action.payload.lineItem.ID),
        1,
        action.payload.lineItem
      )
      state.order = action.payload.order
    })
  },
})

export const { clearCurrentOrder } = ocCurrentOrderSlice.actions

export default ocCurrentOrderSlice.reducer
