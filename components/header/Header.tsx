"use client";

import { useState } from "react";
import HeaderLogo from "./HeaderLogo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#1F2937] text-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-3xl focus:outline-none"
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
