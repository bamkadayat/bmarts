"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import Link from "next/link";

import { IoLogInOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import LogoutButton from "@/components/users/logout/LogoutButton";

export default function DesktopNav() {
  const user = useSelector((state: RootState) => state.auth.user);

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
          <LogoutButton />
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
            <IoPersonAddOutline
              className="text-white hover:text-gray-400 mr-1 font-thin"
              size={18}
            />
            <span>Register</span>
          </Link>
        </>
      )}
    </nav>
  );
}
