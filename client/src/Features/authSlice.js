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
      state.loading = false;
      state.currentUser = action.payload?.user?.email;
      state.userId = action.payload?.user.id;
      state.token = action.payload?.user?.key;
      state.userType = action.payload?.userType;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.token = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action?.payload?.patient
        ? action?.payload?.patient.email
        : action?.payload?.doctor
        ? action?.payload?.doctor?.email
        : action?.payload?.admin?.email;
      state.token = action?.payload?.key;
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
