import { createSlice } from "@reduxjs/toolkit"
import dayjs from "dayjs";


const customsSlice = createSlice({
  name: 'customs',
  initialState: {
    listFilters: {
      'start_date': dayjs().format('YYYY-MM-DD'),
    }
  },
  reducers: {
    setListFilters(state, action) {
      state.listFilters = action.payload
    }
  }
})


export const {
  setListFilters
} = customsSlice.actions

export default customsSlice.reducer
