import { configureStore } from "@reduxjs/toolkit";
import order from "./slices/order";
import user from "./slices/user";

const store = configureStore({
  reducer: {
    order,
    user
  }
})

export default store
