import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { AddProduct, EditProduct, DeleteProduct, Product, ArtsState } from "@/types/arts/artType";

// Fallback for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Utility function for API requests
const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// Initial state
const initialState: ArtsState = {
  products: [], 
  loading: false,
  error: null,
};

// Async Thunks
// Fetch products
export const fetchProducts = createAsyncThunk("arts/fetchProducts", async () => {
  const response = await fetch(`${API_URL}/api/products`);
  const data = await response.json();
  return data.data; // Assuming `data` contains the array of products
});

// Add product
export const addProduct = createAsyncThunk(
  "arts/addProduct",
  async (product: AddProduct): Promise<Product> => {
    return await apiRequest(`${API_URL}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }
);

// Edit product
export const editProduct = createAsyncThunk(
  "arts/editProduct",
  async ({ id, product }: EditProduct): Promise<Product> => {
    return await apiRequest(`${API_URL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "arts/deleteProduct",
  async ({ id }: DeleteProduct): Promise<string> => {
    await apiRequest(`${API_URL}/api/admin/products/${id}`, { method: "DELETE" });
    return id; // Return the ID to update the state
  }
);

// Slice
const artsSlice = createSlice({
  name: "arts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = Array.isArray(action.payload) ? action.payload : [];
    });

    // Add product
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });

    // Edit product
    builder.addCase(editProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
    });

    // Delete product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    });

    // Global pending and error handling for all async actions
    builder.addMatcher(isPending(fetchProducts, addProduct, editProduct, deleteProduct), (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(isRejected(fetchProducts, addProduct, editProduct, deleteProduct), (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });

    builder.addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state) => {
        state.loading = false;
      }
    );
  },
});

// Selectors
export const selectArts = (state: RootState) => state.arts.products;
export const selectArtsLoading = (state: RootState) => state.arts.loading;
export const selectArtsError = (state: RootState) => state.arts.error;

export default artsSlice.reducer;
