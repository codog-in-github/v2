import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    userInfo: {}
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    }
  }
})

export const actions = userSlice.actions;

export default userSlice.reducer;
