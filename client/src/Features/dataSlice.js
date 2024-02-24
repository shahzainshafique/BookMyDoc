import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    loading: false,
    contentCategories: [],
    contents: [],
    branches: [],
    complaints: [],
    doctors: [],
    patients: [],
    appointments: [],
    cities: [],
    messages: [],
    events: [],
    weekdays: [],
    files: [],
    tasks: [],
    notes: [],
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    getDataSuccess: (state, { payload }) => {
      state.loading = false;
      state[payload.url] = payload?.data;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});
export const { fetchStart, getDataSuccess, fetchFail } = dataSlice;
export default dataSlice;
