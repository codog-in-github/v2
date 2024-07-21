import { ORDER_TYPE_EXPORT } from "@/constant"
import { createSlice } from "@reduxjs/toolkit"


const orderSlice = createSlice({
  name: 'order',
  initialState: {
    type: ORDER_TYPE_EXPORT
  },
  reducers: {
    setOrderType(state, action) {
      state.type = action.payload
    }
  }
})


export const {
  setOrderType
} = orderSlice.actions

export default orderSlice.reducer
