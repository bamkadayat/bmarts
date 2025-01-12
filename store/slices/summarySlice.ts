import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SummaryState {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    loading: boolean;
    error: string | null;
  }

  const initialState: SummaryState = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    loading: false,
    error: null,
  };

  export const fetchSummary = createAsyncThunk('summary/fetchSummary', async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch summary data');
      }
      const result =  await response.json();
      return result.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  });
  

  const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSummary.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSummary.fulfilled, (state, action) => {
          state.loading = false;
          state.totalProducts = action.payload.totalProducts;
          state.totalOrders = action.payload.totalOrders;
          state.totalUsers = action.payload.totalUsers;
        })
        .addCase(fetchSummary.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch summary data';
        });
    },
  });
  
  export default summarySlice.reducer;