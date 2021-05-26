import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'
import { BuyerProduct, Me, RequiredDeep, Spec, Variant } from 'ordercloud-javascript-sdk'
import { createOcAsyncThunk } from '../ocReduxHelpers'
import { OcThunkApi } from '../ocStore'
import { cacheProduct, ocProductCacheSelectors } from '../ocProductCache'

interface OcProductDetailState {
  error?: SerializedError
  product?: RequiredDeep<BuyerProduct>
  specs?: RequiredDeep<Spec>[]
  variants?: RequiredDeep<Variant>[]
}

const initialState: OcProductDetailState = {}

const getProductSpecs = createOcAsyncThunk<RequiredDeep<Spec>[], string>(
  'ocProductDetail/getSpecs',
  async (productId) => {
    const response = await Me.ListSpecs(productId, { pageSize: 100 })
    return response.Items
  }
)

const getProductVariants = createOcAsyncThunk<RequiredDeep<Variant>[], string>(
  'ocProductDetail/getVariants',
  async (productId) => {
    const response = await Me.ListVariants(productId, { pageSize: 100 })
    return response.Items
  }
)

export const setProductId = createAsyncThunk<RequiredDeep<BuyerProduct>, string, OcThunkApi>(
  'ocProductDetail/setProductId',
  async (productId, ThunkAPI) => {
    let product = ocProductCacheSelectors.selectById(ThunkAPI.getState(), productId)

    if (!product) {
      product = await Me.GetProduct(productId)
      ThunkAPI.dispatch(cacheProduct(product))
    }

    if (product.SpecCount > 0) {
      ThunkAPI.dispatch(getProductSpecs(product.ID))
    }

    if (product.VariantCount > 0) {
      ThunkAPI.dispatch(getProductVariants(product.ID))
    }

    return product
  }
)

const ocProductDetailSlice = createSlice({
  name: 'ocProductDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProductId.pending, (state) => {
      state.error = undefined
      state.specs = undefined
      state.variants = undefined
      state.product = undefined
    })
    builder.addCase(setProductId.fulfilled, (state, action) => {
      state.product = action.payload
    })
    builder.addCase(setProductId.rejected, (state, action) => {
      state.error = action.error
    })
    builder.addCase(getProductSpecs.fulfilled, (state, action) => {
      state.specs = action.payload
    })
    builder.addCase(getProductVariants.fulfilled, (state, action) => {
      state.variants = action.payload
    })
  },
})

export default ocProductDetailSlice.reducer
