import { AccessToken, Auth, RequiredDeep, Tokens } from 'ordercloud-javascript-sdk'
import { retrieveOrder, transferAnonOrder } from '../ocCurrentOrder'
import { clearProducts } from '../ocProductList'
import { createOcAsyncThunk } from '../ocReduxHelpers'
import { clearUser, getUser } from '../ocUser'

export interface LoginActionRequest {
  username: string
  password: string
  remember?: boolean
}

const login = createOcAsyncThunk<RequiredDeep<AccessToken>, LoginActionRequest>(
  'ocAuth/login',
  async (credentials, thunkAPI) => {
    const { ocConfig } = thunkAPI.getState()
    if (!ocConfig.value) {
      throw new Error('OrderCloud Provider was not properly configured')
    }

    const { ocCurrentOrder } = thunkAPI.getState()

    // set the transfer token if the anonymous user has an in progress order
    let transferToken
    if (ocCurrentOrder && ocCurrentOrder.order) {
      transferToken = Tokens.GetAccessToken()
    }

    thunkAPI.dispatch(clearUser())
    thunkAPI.dispatch(clearProducts())

    const response = await Auth.Login(
      credentials.username,
      credentials.password,
      ocConfig.value.clientId,
      ocConfig.value.scope
    )

    Tokens.SetAccessToken(response.access_token)
    if (credentials.remember && response.refresh_token) {
      Tokens.SetRefreshToken(response.refresh_token)
    }

    thunkAPI.dispatch(getUser())

    // transfer the order if a transfer token was set
    if (transferToken) {
      thunkAPI.dispatch(transferAnonOrder(transferToken))
    } else {
      thunkAPI.dispatch(retrieveOrder())
    }
    return response
  }
)

export default login
