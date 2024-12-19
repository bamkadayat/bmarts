"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { fetchProducts } from "@/store/slices/artsSlice";
import { fetchUsers } from "@/store/slices/usersSlice";

interface AdminStoreProviderProps {
  children: React.ReactNode;
}

export default function AdminStoreProvider({ children }: AdminStoreProviderProps) {
  useEffect(() => {
    // Dispatch initial data fetches
    store.dispatch(fetchProducts());
    store.dispatch(fetchUsers());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
