import { configureStore } from "@reduxjs/toolkit";
import order from "./slices/order";
import user from "./slices/user";
import customs from "./slices/customs.js";

const store = configureStore({
  reducer: {
    order,
    user,
    customs
  }
})

export default store
