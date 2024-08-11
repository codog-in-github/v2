import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    userInfo: {
      name: '',
      role: null,
    }
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

export const {
  setUserInfo
} = userSlice.actions;

export default userSlice.reducer;
