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
      const url = process.env.NEXT_PUBLIC_API_URL || ""; 
      const response = await fetch(`${url}/api/users/logout`, { method: "POST" });
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
          <Link href="/overview" className="hover:text-gray-400 font-semibold">
            Overview
          </Link>
          <Link href="/profile" className="hover:text-gray-400 font-semibold">
            Profile
          </Link>
        </>
      )}
      <Link href="/shop" className="hover:text-gray-400 font-semibold">
        Shop
      </Link>
      {user ? (
        <>
          <button
            onClick={handleLogout}
            className="hover:text-gray-400 font-semibold transition duration-200"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className=" text-white hover:text-gray-400 font-semibold "
          >
            Login
          </Link>
          <Link
            href="/register"
            className=" text-white hover:text-gray-400 font-semibold"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
