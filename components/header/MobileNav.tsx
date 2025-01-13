"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { IoLogInOutline, IoPersonAddOutline } from "react-icons/io5";
import LogoutButton from "@/components/users/logout/LogoutButton";
import { motion } from "framer-motion";
import { navVariants, navContainerVariants } from "@/components/animation/Animation";

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
    <motion.div
      ref={menuRef}
      className={`fixed top-0 left-0 w-full h-screen bg-secondary text-black z-50 ${
        menuOpen ? "block" : "hidden"
      }`}
      tabIndex={-1}
      role="dialog"
      aria-hidden={!menuOpen}
      initial="hidden"
      animate={menuOpen ? "show" : "hidden"}
      variants={navContainerVariants}
    >
      {/* Close Button */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 text-black text-2xl font-semibold hover:text-gray-400"
        aria-label="Close menu"
      >
        &#10005;
      </button>

      {/* Navigation Links */}
      <motion.div
        className="flex flex-col items-center justify-center h-full space-y-6"
        variants={navContainerVariants}
        initial="hidden"
        animate="show"
      >
        {user && (
          <>
            <motion.div variants={navVariants}>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="font-semibold text-[25px]">
                Order
              </Link>
            </motion.div>
            <motion.div variants={navVariants}>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="font-semibold text-[25px]">
                Profile
              </Link>
            </motion.div>
          </>
        )}
        <motion.div variants={navVariants}>
          <Link href="/arts" onClick={() => setMenuOpen(false)} className="font-semibold text-[25px]">
            Arts
          </Link>
        </motion.div>
        {user ? (
          <motion.div variants={navVariants}>
            <LogoutButton />
          </motion.div>
        ) : (
          <>
            <motion.div variants={navVariants}>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="font-semibold flex items-center cursor-pointer text-[25px]"
              >
                <IoLogInOutline className="text-black hover:text-gray-400 mr-1 font-thin" size={22} />
                <span>Login</span>
              </Link>
            </motion.div>
            <motion.div variants={navVariants}>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="font-semibold flex items-center cursor-pointer text-[25px]"
              >
                <IoPersonAddOutline className="text-black hover:text-gray-400 mr-1 font-thin" size={18} />
                <span>Register</span>
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
