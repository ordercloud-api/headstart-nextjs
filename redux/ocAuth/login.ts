import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AccessToken,
  Auth,
  RequiredDeep,
  Tokens,
} from "ordercloud-javascript-sdk";
import { OcThunkApi } from "../ocStore";
import { getUser } from "../ocUser";

export interface LoginActionRequest {
  username: string;
  password: string;
  remember?: boolean;
}

const login = createAsyncThunk<
  RequiredDeep<AccessToken>,
  LoginActionRequest,
  OcThunkApi
>("ocAuth/login", async (credentials, thunkAPI) => {
  const { ocConfig } = thunkAPI.getState();
  if (!ocConfig.value) {
    throw new Error("OrderCloud Provider was not properly configured");
  }
  const response = await Auth.Login(
    credentials.username,
    credentials.password,
    ocConfig.value.clientId,
    ocConfig.value.scope
  );
  // thunkAPI.dispatch(cleanCatalogCache());
  Tokens.SetAccessToken(response.access_token);
  if (credentials.remember && response.refresh_token) {
    Tokens.SetRefreshToken(response.refresh_token);
  }
  thunkAPI.dispatch(getUser());
  return response;
});

export default login;
