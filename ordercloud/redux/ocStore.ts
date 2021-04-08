import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import ocConfig from './ocConfig'
import ocAuth from './ocAuth'
import ocUser from './ocUser'
import ocProductList from './ocProductList'
import ocProductDetail from './ocProductDetail'

const store = configureStore({
  reducer: {
    ocConfig,
    ocAuth,
    ocUser,
    ocProductList,
    ocProductDetail,
  },
})

export type OcRootState = ReturnType<typeof store.getState>
export type OcDispatch = typeof store.dispatch
export type OcThunkApi = {
  dispatch: OcDispatch
  state: OcRootState
}

export const useOcDispatch = () => useDispatch<OcDispatch>()
export const useOcSelector: TypedUseSelectorHook<OcRootState> = useSelector

export default store
