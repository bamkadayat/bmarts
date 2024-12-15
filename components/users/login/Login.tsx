"use client"
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
    const resultAction = await dispatch(login(data)); // Dispatch the login thunk

    if (login.fulfilled.match(resultAction)) {
      router.push("/orders"); // Navigate to "orders" on successful login
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
