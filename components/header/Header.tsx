"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; 
import HeaderLogo from "./HeaderLogo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname(); 
   /** Check if the route starts with "/dashboard" */ 
  const isDashboard = pathname.startsWith("/dashboard");

  /** Do not render Header on dashboard pages */ 
  if (isDashboard) return null; 

  return (
    <header className="bg-secondary text-white sticky top-0 left-0 w-full z-50 shadow-sm shadow-black/40">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-4xl focus:outline-none"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </header>
  );
}
