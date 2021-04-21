import { createSlice, SerializedError } from '@reduxjs/toolkit'
import {
  BuyerProduct,
  Filters,
  ListPageWithFacets,
  Me,
  MetaWithFacets,
} from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk, OcThrottle } from '../ocReduxHelpers'

export interface OcProductListOptions {
  catalogID?: string
  categoryID?: string
  search?: string
  page?: number
  pageSize?: number
  depth?: string
  searchOn?: string[]
  sortBy?: string[]
  filters?: Filters
}

interface OcProductListState {
  loading: boolean
  error?: SerializedError
  options?: OcProductListOptions
  items?: BuyerProduct[]
  meta?: MetaWithFacets
}

const initialState: OcProductListState = {
  loading: false,
}

interface SetListOptionsResult {
  response: ListPageWithFacets<BuyerProduct>
  options: OcProductListOptions
}

const productListThrottle: OcThrottle = {
  location: 'ocProductList',
  property: 'loading',
}

export const setListOptions = createOcAsyncThunk<SetListOptionsResult, OcProductListOptions>(
  'ocProductList/setOptions',
  async (options) => {
    const response = await Me.ListProducts(options)
    return {
      response,
      options,
    }
  },
  productListThrottle
)

const ocProductListSlice = createSlice({
  name: 'ocProductList',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.loading = false
      state.options = undefined
      state.error = undefined
      state.items = undefined
      state.meta = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setListOptions.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(setListOptions.fulfilled, (state, action) => {
      state.items = action.payload.response.Items
      state.meta = action.payload.response.Meta
      state.options = action.payload.options
      state.loading = false
    })
    builder.addCase(setListOptions.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })
  },
})

export const { clearProducts } = ocProductListSlice.actions

export default ocProductListSlice.reducer
