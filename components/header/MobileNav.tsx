"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { IoLogInOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import LogoutButton from "@/components/users/logout/LogoutButton";
import { IoCartOutline } from "react-icons/io5";

interface MobileNavProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileNav({ menuOpen, setMenuOpen }: MobileNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (menuOpen) {
      const firstLink = menuRef.current?.querySelector("a");
      firstLink?.focus();
    }
  }, [menuOpen]);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-screen bg-black text-white transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0 w-full" : "-translate-x-full w-0 overflow-hidden"
      } z-40`}
      tabIndex={-1}
      role="dialog"
      aria-hidden={!menuOpen}
    >
      {/* Close Button */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 text-white text-2xl font-semibold hover:text-gray-400"
        aria-label="Close menu"
      >
        &#10005;
      </button>

      {/* Navigation Links */}
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        {user && (
          <>
            <Link href="/orders" onClick={() => setMenuOpen(false)} className="font-semibold text-[18px]">
              Orders
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="font-semibold text-[20px]">
              Profile
            </Link>
          </>
        )}
        <Link href="/arts" onClick={() => setMenuOpen(false)} className="font-semibold  text-[20px]">
          Arts
        </Link>
        <Link
        href="/cart"
        className="text-white hover:text-gray-400 font-semibold flex items-center justify-space-between cursor-pointer text-[20px]"
      >
        <IoCartOutline
          className="text-white hover:text-gray-400 font-thin mr-1"
          size={22}
        />
        <span>cart</span>
      </Link>
        {user ? (
        <LogoutButton />
        ) : (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="font-semibold flex items-center justify-space-between cursor-pointer text-[20px]">
            <IoLogInOutline
              className="text-white hover:text-gray-400 mr-1 font-thin"
              size={22}
            />
              <span>Login</span>
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="font-semibold flex items-center justify-space-between cursor-pointer text-[20px]">
            <IoPersonAddOutline className="text-white hover:text-gray-400 mr-1 font-thin "
              size={18} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
