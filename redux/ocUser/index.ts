import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { Me, MeUser, RequiredDeep } from "ordercloud-javascript-sdk";
import { OcThunkApi } from "../ocStore";

interface ocUserState {
  user?: MeUser;
  loading: boolean;
  error?: SerializedError;
}

const initialState: ocUserState = {
  loading: true,
};

export const getUser = createAsyncThunk<
  RequiredDeep<MeUser>,
  undefined,
  OcThunkApi
>("ocUser/get", async (_, thunkAPI) => {
  return Me.Get();
});

export const updateUser = createAsyncThunk<
  Partial<MeUser>,
  RequiredDeep<MeUser>,
  OcThunkApi
>("ocUser/update", async (data, thunkAPI) => {
  return Me.Patch(data);
});

const ocUserSlice = createSlice({
  name: "ocUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.user = undefined;
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ocUserSlice.reducer;
