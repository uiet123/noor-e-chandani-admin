import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,  // null = not logged in
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
    logoutAdmin(state) {
      state.admin = null;
    }
  }
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
