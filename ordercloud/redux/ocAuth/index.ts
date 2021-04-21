import { createSlice, SerializedError } from '@reduxjs/toolkit'
import { DecodedToken, Tokens } from 'ordercloud-javascript-sdk'
import parseJwt from '../../utils/parseJwt'
import login from './login'
import logout from './logout'

interface OcAuthState {
  isAuthenticated: boolean
  decodedToken?: DecodedToken
  isAnonymous: boolean
  error?: SerializedError
  loading: boolean
}

const initialAccessToken = Tokens.GetAccessToken()
let isAnonymous = true
let decodedToken

if (initialAccessToken) {
  decodedToken = parseJwt(initialAccessToken)
  isAnonymous = !!decodedToken.orderid
}

const initialState: OcAuthState = {
  decodedToken,
  isAuthenticated: !!initialAccessToken,
  isAnonymous,
  loading: false,
}

const ocAuthSlice = createSlice({
  name: 'ocAuth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN CASES
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAnonymous = false
      state.isAuthenticated = true
      state.decodedToken = parseJwt(action.payload.access_token)
      state.loading = false
    })
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })

    // LOGOUT CASES
    builder.addCase(logout.pending, (state) => {
      state.loading = true
      state.decodedToken = undefined
      state.isAuthenticated = false
      state.isAnonymous = true
      state.error = undefined
    })
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isAnonymous = true
      state.isAuthenticated = true
      state.decodedToken = action.payload ? parseJwt(action.payload.access_token) : undefined
      state.loading = false
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })
  },
})

export default ocAuthSlice.reducer
