"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (data: { email: string; password: string }) => {
    const resultAction = await dispatch(login(data));

    if (login.fulfilled.match(resultAction)) {
      const { role } = resultAction.payload.user;
      if (role === "ADMIN") {
        router.push("/dashboard");
      } else if (role === "USER") {
        router.push("/orders");
      }
    } else {
      console.log("Login failed:", resultAction.error.message);
    }
  };

  return (
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
  );
}
