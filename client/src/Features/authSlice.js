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
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      console.log("act", action);
      state.loading = false;
      state.currentUser = action?.payload?.doctor?.email;
      state.userId = action?.payload?.doctor?._id;
      state.token = action?.payload?.token || "";
      state.userType = action?.payload?.userType || "";
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
  },
} = authSlice;

export default authSlice;
