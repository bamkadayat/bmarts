import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import artsReducer from "./slices/artsSlice";
import usersReducer from "@/store/slices/usersSlice";
import productsReducer from "@/store/slices/productsSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    arts: artsReducer,
    users: usersReducer,
    products: productsReducer
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
