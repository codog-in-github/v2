import { configureStore } from "@reduxjs/toolkit";
import order from "./slices/order";

const store = configureStore({
  reducer: {
    order
  }
})

export default store
