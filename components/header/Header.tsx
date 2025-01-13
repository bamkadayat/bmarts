"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import HeaderLogo from "./HeaderLogo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.items);
  const [cartItemCount, setCartItemCount] = useState<number | null>(null);

    useEffect(() => {
      setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0));
    }, [cart]);

  const pathname = usePathname();
  /** Check if the route starts with "/dashboard" */
  const isDashboard = pathname.startsWith("/dashboard");

  /** Do not render Header on dashboard pages */
  if (isDashboard) return null;

  return (
    <header className="bg-secondary sticky top-0 left-0 w-full z-50 ">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center focus:outline-none">
          <div>
          <Link
            href="/cart"
            className="text-black relative hover:text-gray-400 font-semibold flex items-center cursor-pointer "
            onClick={() => setMenuOpen(false)}
          >
            <IoCartOutline className="text-black hover:text-gray-400 font-thin mr-3 mt-1" size={28} />
            {cartItemCount !== null && cartItemCount > 0 && (
              <span
                className="absolute top-0 -right-1 bg-slate-500 text-white font-semibold text-xs rounded-full w-5 h-5 flex items-center justify-center"
                aria-label={`${cartItemCount} items in cart`}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
          </div>
          <div>
            <button
              className="md:hidden flex items-center text-4xl focus:outline-none"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              &#9776;
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
}
