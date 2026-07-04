import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./sharedcomponents/appSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export default store;
