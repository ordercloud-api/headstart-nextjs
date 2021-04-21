import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrderCloudError } from 'ordercloud-javascript-sdk'
import { OcRootState } from '../ocStore'

interface OcErrorEntry {
  error: OrderCloudError
  timestamp: number
}

const ocErrorAdapter = createEntityAdapter<OcErrorEntry>({
  selectId: (e) => e.timestamp,
})

const ocErrorsSlice = createSlice({
  name: 'ocErrors',
  initialState: ocErrorAdapter.getInitialState(),
  reducers: {
    logError: (state, action: PayloadAction<OrderCloudError>) => {
      ocErrorAdapter.addOne(state, {
        error: action.payload,
        timestamp: new Date().getTime(),
      })
    },
  },
})

export const ocErrorSelectors = ocErrorAdapter.getSelectors<OcRootState>((s) => s.ocErrors)

export const { logError } = ocErrorsSlice.actions

export default ocErrorsSlice.reducer
