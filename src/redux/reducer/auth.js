import { createSlice } from "@reduxjs/toolkit";
import { authService } from '../../services/authService';

// Load initial state from localStorage
const storedUser = authService.getStoredUser();

const initialState = {
  user: storedUser ? { email: storedUser.email } : null,
  role: storedUser ? storedUser.role : null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.logout();
    }
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
