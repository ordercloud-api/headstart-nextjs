import { AsyncThunkPayloadCreator, createAsyncThunk } from "@reduxjs/toolkit";
import logout from "./ocAuth/logout";
import { OcRootState, OcThunkApi } from "./ocStore";

function getDescendantProp(obj: any, desc: string) {
  var arr = desc.split(".");
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
}

export interface OcThrottle {
  location: keyof OcRootState;
  property: string;
}

export function createOcAsyncThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, OcThunkApi>,
  throttle?: OcThrottle
) {
  return createAsyncThunk<Returned, ThunkArg, OcThunkApi>(
    typePrefix,
    async (args, thunkAPI) => {
      try {
        return await payloadCreator(args, thunkAPI);
      } catch (err) {
        if (err.isOrderCloudError) {
          switch (err.status) {
            case 401:
              thunkAPI.dispatch(logout());
              break;
            default:
              break;
          }
        }
        throw err;
      }
    },
    {
      condition: (arg, api) => {
        if (throttle) {
          const state = api.getState()[throttle.location];
          const isThrottled = getDescendantProp(state, throttle.property);
          if (typeof isThrottled === "boolean" && isThrottled) {
            return false;
          }
        }
      },
    }
  );
}
