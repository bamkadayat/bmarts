import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

/**  Login thunk  */
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const url = process.env.NEXT_PUBLIC_APP_URL || ""; // Ensure URL is defined
      const response = await fetch(`${url}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Invalid login credentials");
      }

      // Parse and return successful response
      const result = await response.json();
      return {
        user: { email: result.email, role: result.role },
        token: result.token,
      };
    } catch (error) {
      console.error("Error during login:", error); // Log detailed error
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as { email: string; role: string } | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: { email: string; role: string };
        token: string;
      }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
