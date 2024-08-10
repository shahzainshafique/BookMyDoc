import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    loading: false,
    userId: "",
    error: false,
    token: null,
    userType: null,
    email: ""
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action?.email;
      state.userId = action?._id;
      state.token = action?.key || "";
      state.userType = action?.userType || "";
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.token = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action?.payload?.email;
      state.error = false;
      state.userType = action?.payload?.userType;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    fetchUserEmail: (state) =>{
      state.email = state.currentUser;
    }
  },
});
export const {
  reducer,
  actions: {
    fetchStart,
    loginSuccess,
    logoutSuccess,
    registerSuccess,
    fetchFail,
    fetchUserEmail
  },
} = authSlice;

export default authSlice;
