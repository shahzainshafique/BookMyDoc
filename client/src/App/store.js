import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice";
import dataReducer from "../Features/dataSlice";

import storage from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer.reducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export default store;
