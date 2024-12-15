"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DesktopNav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");

      document.cookie = "authToken=; path=/; max-age=0;";
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {user && (
        <>
          <Link href="/overview" className="hover:text-gray-400">
            Overview
          </Link>
          <Link href="/profile" className="hover:text-gray-400">
            Profile
          </Link>
        </>
      )}
      <Link href="/shop" className="hover:text-gray-400">
        Shop
      </Link>
      {user ? (
        <>
          <span className="hidden sm:inline-block text-gray-300">
            Welcome, {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gray-800 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
