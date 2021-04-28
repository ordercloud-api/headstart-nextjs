import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiRole, Configuration, CookieOptions } from 'ordercloud-javascript-sdk'

export interface OcConfig {
  clientId: string
  scope: ApiRole[]
  baseApiUrl?: string
  allowAnonymous?: boolean
  cookieOptions?: CookieOptions
}

interface OcConfigState {
  value?: OcConfig
}

const initialState: OcConfigState = {}

const ocConfigSlice = createSlice({
  name: 'ocConfig',
  initialState,
  reducers: {
    setConfig: (state: OcConfigState, action: PayloadAction<OcConfig>) => {
      Configuration.Set({
        clientID: action.payload.clientId,
        baseApiUrl: action.payload.baseApiUrl,
        cookieOptions: action.payload.cookieOptions,
      })
      state.value = action.payload
    },
  },
})

export const { setConfig } = ocConfigSlice.actions

export default ocConfigSlice.reducer
