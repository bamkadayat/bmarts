"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
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
  if (user && token) {
    store.dispatch(loginSuccess({ user, token }));
  }

  return <Provider store={store}>{children}</Provider>;
}
