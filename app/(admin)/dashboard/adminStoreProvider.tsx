"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { fetchProducts } from "@/store/slices/artsSlice";

interface AdminStoreProviderProps {
  children: React.ReactNode;
}

export default function AdminStoreProvider({ children }: AdminStoreProviderProps) {
  useEffect(() => {
    store.dispatch(fetchProducts());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
