import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import artsReducer from "./slices/artsSlice";
import usersReducer from "@/store/slices/usersSlice";
import productsReducer from "@/store/slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    arts: artsReducer,
    users: usersReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
