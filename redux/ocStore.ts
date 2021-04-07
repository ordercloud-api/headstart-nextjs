import { configureStore } from "@reduxjs/toolkit";
import ocConfig from "./ocConfig";
import ocAuth from "./ocAuth";
import ocUser from "./ocUser";
import ocProductList from "./ocProductList";
import ocProductDetail from "./ocProductDetail";

const store = configureStore({
  reducer: {
    ocConfig,
    ocAuth,
    ocUser,
    ocProductList,
    ocProductDetail,
  },
});

export type OcRootState = ReturnType<typeof store.getState>;
export type OcDispatch = typeof store.dispatch;
export type OcThunkApi = {
  dispatch: OcDispatch;
  state: OcRootState;
};

export default store;
