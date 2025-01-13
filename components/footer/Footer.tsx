"use client";
import { usePathname } from "next/navigation"; 
export default function Footer() {
  const pathname = usePathname(); 
  const isDashboard = pathname.startsWith("/dashboard");

  /** Do not render Footer on dashboard pages */ 
  if (isDashboard) return null; 
  return (
    <footer className="bg-secondary text-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} BM Arts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
