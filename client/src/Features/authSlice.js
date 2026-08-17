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
    patientId: "",
    patientName: "",
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
      const payload = action?.payload;
      state.loading = false;
      state.token = payload?.token || "";
      state.userType = payload?.userType || "";

      // Doctor login payloads carry a `doctor`, patient logins a `patient`.
      if (payload?.doctor) {
        state.currentUser = payload.doctor.email;
        state.doctorName = `${payload.doctor.firstname} ${payload.doctor.lastname}`;
        state.doctorProfileImage = url + "/" + payload.doctor.profileImage;
        state.doctorId = payload.doctor._id;
      }
      if (payload?.patient) {
        state.currentUser = payload.patient.email;
        state.patientName = `${payload.patient.firstname} ${payload.patient.lastname}`;
        state.patientId = payload.patient._id;
      }
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.token = null;
      state.userType = null;
      state.doctorId = "";
      state.doctorName = "";
      state.doctorProfileImage = "";
      state.patientId = "";
      state.patientName = "";
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
