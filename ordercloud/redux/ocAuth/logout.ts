import {
  AccessToken,
  Auth,
  RequiredDeep,
  Tokens,
} from "ordercloud-javascript-sdk";
import { clearProducts } from "../ocProductList";
import { createOcAsyncThunk, OcThrottle } from "../ocReduxHelpers";
import { clearUser, getUser } from "../ocUser";

const logoutThrottle: OcThrottle = {
  location: "ocAuth",
  property: "loading",
};

const logout = createOcAsyncThunk<RequiredDeep<AccessToken> | undefined>(
  "ocAuth/logout",
  async (_, thunkAPI) => {
    const { ocConfig } = thunkAPI.getState();
    if (!ocConfig.value) {
      throw new Error("OrderCloud Provider was not properly configured");
    }

    thunkAPI.dispatch(clearUser());
    thunkAPI.dispatch(clearProducts());

    if (ocConfig.value.allowAnonymous) {
      const response = await Auth.Anonymous(
        ocConfig.value.clientId,
        ocConfig.value.scope
      );
      Tokens.SetAccessToken(response.access_token);
      Tokens.SetRefreshToken(response.refresh_token);
      thunkAPI.dispatch(getUser());
      return response;
    } else {
      Tokens.RemoveAccessToken();
      Tokens.RemoveRefreshToken();
    }
    return;
  },
  logoutThrottle
);

export default logout;
