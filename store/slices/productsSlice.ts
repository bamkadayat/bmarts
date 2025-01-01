import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";

// Define the type for the product
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  publicId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  date: string;
}

// Define the state type
export interface ProductsState {
  products: Product[];
  recentProducts: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductsState = {
  products: [],
  recentProducts: [],
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ""; 

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }
      const data = await response.json();
      return data.data; // Assuming the API returns { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Async thunk for fetching recent products
export const fetchRecentProducts = createAsyncThunk(
  "products/fetchRecentProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/recents`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recent products");
      }
      const data = await response.json();
      return data.data; // Assuming the API returns { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch recent products
      .addCase(fetchRecentProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recentProducts = action.payload;
      })
      .addCase(fetchRecentProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Memoized Selectors
export const selectProducts = createSelector(
  (state: RootState) => state.products,
  (productsState) => ({
    products: productsState.products,
    recentProducts: productsState.recentProducts,
    loading: productsState.loading,
    error: productsState.error,
  })
);

export const selectRecentProducts = (state: RootState) => state.products.recentProducts;

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
