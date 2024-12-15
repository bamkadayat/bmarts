"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store, AppStore } from "@/store";
import { loginSuccess } from "@/store/slices/authSlice";

interface StoreProviderProps {
  user: { email: string; role: string } | null;
  token: string | null;
  children: React.ReactNode;
}

export default function StoreProvider({
  user,
  token,
  children,
}: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = store();

    if (user && token) {
      storeRef.current.dispatch(loginSuccess({ user, token }));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
