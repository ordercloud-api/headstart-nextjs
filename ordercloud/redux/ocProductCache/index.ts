import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BuyerProduct, Me, RequiredDeep } from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk } from '../ocReduxHelpers'
import { OcProductListOptions } from '../ocProductList'
import { OcRootState } from '../ocStore'

export const ocProductsAdapter = createEntityAdapter<RequiredDeep<BuyerProduct>>({
  selectId: (p) => p.ID,
})

export const ocProductCacheSelectors = ocProductsAdapter.getSelectors<OcRootState>(
  (s) => s.ocProductCache
)

export const listProducts = createOcAsyncThunk<RequiredDeep<BuyerProduct>[], OcProductListOptions>(
  'ocProducts/list',
  async (options) => {
    const response = await Me.ListProducts(options)
    return response.Items
  }
)

export const getProduct = createOcAsyncThunk<RequiredDeep<BuyerProduct>, string>(
  'ocProducts/get',
  async (productId) => {
    const response = await Me.GetProduct(productId)
    return response
  }
)

const ocProductCacheSlice = createSlice({
  name: 'ocProducts',
  initialState: ocProductsAdapter.getInitialState(),
  reducers: {
    cleanProductCache: (state) => {
      ocProductsAdapter.removeAll(state)
    },
    cacheProducts: (state, action: PayloadAction<RequiredDeep<BuyerProduct>[]>) => {
      ocProductsAdapter.upsertMany(state, action)
    },
    cacheProduct: (state, action: PayloadAction<RequiredDeep<BuyerProduct>>) => {
      ocProductsAdapter.upsertOne(state, action)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listProducts.fulfilled, ocProductsAdapter.upsertMany)
    builder.addCase(getProduct.fulfilled, ocProductsAdapter.upsertOne)
  },
})

export const { cacheProducts, cacheProduct, cleanProductCache } = ocProductCacheSlice.actions

export default ocProductCacheSlice.reducer
