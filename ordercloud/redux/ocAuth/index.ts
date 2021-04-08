import { createSlice, SerializedError } from '@reduxjs/toolkit'
import { Tokens } from 'ordercloud-javascript-sdk'
import login from './login'
import logout from './logout'

function parseJwt(token?: string) {
  if (!token) return {}
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

interface OcAuthState {
  isAuthenticated: boolean
  isAnonymous: boolean
  error?: SerializedError
  loading: boolean
}

const initialAccessToken = Tokens.GetAccessToken()
let isAnonymous = true

if (initialAccessToken) {
  const parsed = parseJwt(initialAccessToken)
  isAnonymous = !!parsed.orderid
}

const initialState: OcAuthState = {
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
      state.loading = false
    })
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })

    // LOGOUT CASES
    builder.addCase(logout.pending, (state) => {
      state.loading = true
      state.isAuthenticated = false
      state.isAnonymous = true
      state.error = undefined
    })
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isAnonymous = true
      state.isAuthenticated = true
      state.loading = false
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error
      state.loading = false
    })
  },
})

export default ocAuthSlice.reducer
