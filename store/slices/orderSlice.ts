import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Order {
  id: number;
  product: string;
  quantity: number;
  price: number;
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
  loading: false,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await fetch("/api/admin/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data: Order[] = await response.json();
  return data;
});


const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
