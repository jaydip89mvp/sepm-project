import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  role: null, // Make sure 'role' has an initial value (can be 'null')
  token: null, // Same for 'token'
  isAuthenticated: false,
  loading: true,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token; // Set the token here
      state.isAuthenticated = true;
      state.loading = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      toast.success("Logged Out");
    },
  },
});

export default authSlice;
export const { setUser, userNotExists } = authSlice.actions;
