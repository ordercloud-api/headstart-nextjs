import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AccessToken,
  Auth,
  RequiredDeep,
  Tokens,
} from "ordercloud-javascript-sdk";
import { OcThunkApi } from "../ocStore";
import { getUser } from "../ocUser";

const logout = createAsyncThunk<
  RequiredDeep<AccessToken> | undefined,
  undefined,
  OcThunkApi
>("ocAuth/logout", async (_, thunkAPI) => {
  const { ocConfig } = thunkAPI.getState();
  if (!ocConfig.value) {
    throw new Error("OrderCloud Provider was not properly configured");
  }
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
});

export default logout;
