"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { IoLogInOutline, IoPersonAddOutline, IoCartOutline } from "react-icons/io5";
import LogoutButton from "@/components/users/logout/LogoutButton";
import { useEffect, useState } from "react";

export default function DesktopNav() {
  const [isMounted, setIsMounted] = useState(false); // Track component mount status
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart.items);

  // Use effect to set the mounted state to true on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return null or skeleton placeholder during the SSR phase
    return null;
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {user && (
        <>
          <Link href="/orders" className="hover:text-gray-400 font-semibold text-[18px]">
            Orders
          </Link>
          <Link href="/profile" className="hover:text-gray-400 font-semibold text-[18px]">
            Profile
          </Link>
        </>
      )}
      <Link href="/arts" className="hover:text-gray-400 font-semibold text-[18px]">
        Arts
      </Link>
      <Link
        href="/cart"
        className="relative text-white hover:text-gray-400 font-semibold cursor-pointer"
      >
        <IoCartOutline
          className="text-white hover:text-gray-400 font-bold"
          size={25}
        />
        {cartItemCount > 0 && (
          <span
            className="absolute top-0 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            aria-label={`${cartItemCount} items in cart`}
          >
            {cartItemCount}
          </span>
        )}
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
            <span className="text-[18px]">Login</span>
          </Link>
          <Link
            href="/register"
            className=" text-white hover:text-gray-400 font-semibold flex items-center justify-space-between cursor-pointer"
          >
            <IoPersonAddOutline
              className="text-white hover:text-gray-400 mr-1 font-thin"
              size={18}
            />
            <span className="text-[18px]">Register</span>
          </Link>
        </>
      )}
    </nav>
  );
}
