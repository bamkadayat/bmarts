import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}
// Fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to fetch profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return rejectWithValue("An error occurred while fetching profile");
    }
  }
);

// Edit profile
export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (updatedData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to update profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue("An error occurred while updating profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearProfile(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
