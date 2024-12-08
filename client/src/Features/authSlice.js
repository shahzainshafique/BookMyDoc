import { createSlice } from "@reduxjs/toolkit";
const url = import.meta.env.VITE_BACKEND_URL;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    doctorName: "",
    currentUser: null,
    loading: false,
    doctorId: "",
    doctorProfileImage: "",
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
      state.doctorName = `${action?.payload?.doctor?.firstname} ${action?.payload?.doctor?.lastname}`; 
      state.doctorProfileImage = url+"/"+action?.payload?.doctor?.profileImage;
      state.doctorId = action?.payload?.doctor?._id;
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
