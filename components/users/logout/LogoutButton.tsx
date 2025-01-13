"use client";

import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

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
    <button
     onClick={handleLogout}
     className="hover:text-gray-400 font-semibold transition duration-200 flex items-center justify-space-between cursor-pointer"
   >
     <MdLogout className="text-black hover:text-gray-400 mr-1 font-thin"
       size={22} />
       <span className="md:text-[18px] text-[25px] ">Logout</span>
   </button>
  );
}
