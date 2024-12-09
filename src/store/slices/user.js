import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    userInfo: {
      name: '',
      role: null,
      department: null,
      id: null,
    },
    message: {
      unread: 0,
    }
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },

    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },

    setUnread(state, action) {
      let nextCount = state.message.unread;
      const payloadCount = action.payload.count;
      switch (action.payload.type) {
        case 'increment':
          nextCount += payloadCount;
          break;
        case 'decrement':
          nextCount -= payloadCount;
          break;
        case 'clearance':
          nextCount = 0;
          break;
        default:
          nextCount = payloadCount;
          break;
      }
      state.message.unread = nextCount;
    }
  }
})

export const {
  setUserInfo,
  setUnread
} = userSlice.actions;

export default userSlice.reducer;
