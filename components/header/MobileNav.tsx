"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileNav({ menuOpen, setMenuOpen }: MobileNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);
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
      setMenuOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-400"
        aria-label="Close menu"
      >
        &#10005;
      </button>

      {/* Navigation Links */}
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        {user && (
          <>
            <Link href="/overview" onClick={() => setMenuOpen(false)}>
              Overview
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          </>
        )}
        <Link href="/shop" onClick={() => setMenuOpen(false)}>
          Shop
        </Link>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
