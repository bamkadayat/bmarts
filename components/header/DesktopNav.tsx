"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoLogInOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

export default function DesktopNav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_APP_URL || "";
      const response = await fetch(`${url}/api/users/logout`, {
        method: "POST",
      });
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
          <Link href="/orders" className="hover:text-gray-400 font-semibold">
            Orders
          </Link>
          <Link href="/profile" className="hover:text-gray-400 font-semibold">
            Profile
          </Link>
        </>
      )}
      <Link href="/arts" className="hover:text-gray-400 font-semibold">
        Arts
      </Link>
      {user ? (
        <>
          <button
            onClick={handleLogout}
            className="hover:text-gray-400 font-semibold transition duration-200 flex items-center justify-space-between cursor-pointer"
          >
            <MdLogout className="text-white hover:text-gray-400 mr-1 font-thin"
              size={22} />
              <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-white hover:text-gray-400 font-semibold flex items-center justify-space-between cursor-pointer"
          >
            <IoLogInOutline
              className="text-white hover:text-gray-400 mr-1 font-thin"
              size={22}
            />
            <span>Login</span>
          </Link>
          <Link
            href="/register"
            className=" text-white hover:text-gray-400 font-semibold flex items-center justify-space-between cursor-pointer"
          >
            <IoPersonAddOutline className="text-white hover:text-gray-400 mr-1 font-thin"
              size={18} />
            <span>Register</span>
          </Link>
        </>
      )}
    </nav>
  );
}
