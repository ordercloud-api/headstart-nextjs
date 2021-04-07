import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import {
  BuyerProduct,
  Filters,
  ListPageWithFacets,
  Me,
  MetaWithFacets,
} from "ordercloud-javascript-sdk";
import { OcThunkApi } from "../ocStore";

export interface OcProductListOptions {
  catalogID?: string;
  categorID?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  depth?: string;
  searchOn?: string[];
  sortBy?: string[];
  filters?: Filters;
}

interface OcProductListState {
  loading: boolean;
  error?: SerializedError;
  options: OcProductListOptions;
  items?: BuyerProduct[];
  meta?: MetaWithFacets;
}

const initialState: OcProductListState = {
  loading: true,
  options: {},
};

interface SetListOptionsResult {
  response: ListPageWithFacets<BuyerProduct>;
  options: OcProductListOptions;
}

export const setListOptions = createAsyncThunk<
  SetListOptionsResult,
  OcProductListOptions,
  OcThunkApi
>("ocProducts/setOptions", async (options, ThunkAPI) => {
  const response = await Me.ListProducts(options);
  return {
    response,
    options,
  };
});

const ocProductListSlice = createSlice({
  name: "ocProductList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setListOptions.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(setListOptions.fulfilled, (state, action) => {
      state.items = action.payload.response.Items;
      state.meta = action.payload.response.Meta;
      state.options = action.payload.options;
      state.loading = false;
    });
    builder.addCase(setListOptions.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ocProductListSlice.reducer;
