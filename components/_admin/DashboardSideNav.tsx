import Link from "next/link";
import LogoutButton from "@/components/users/logout/LogoutButton";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { LuLayoutList } from "react-icons/lu";
export default function DashboardSideNav() {
  return (
    <aside className="w-64 bg-dashboardDark text-white flex flex-col h-screen fixed">
      <div className="p-4 text-2xl font-semibold border-b border-gray-600 flex items-center justify-between">
        <span>Admin Panel </span>{" "}
        <Link href={"/"} className="text-sm text-right block justify-end">
          <FaExternalLinkAlt size={20} color="white" />
        </Link>
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px] flex items-center"
            >
              <MdDashboard size={20} color="white" />
              <span className="ml-2">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/arts"
              className="flex items-center py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              <AiOutlineProduct size={20} color="white" />
              <span className="ml-2">Arts</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/users"
              className="flex items-center py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              <FaUsers size={20} color="white" />
              <span className="ml-2">Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/orders"
              className="flex items-center py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
               <LuLayoutList size={20} color="white" />
               <span className="ml-2">Orders</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-600">
        <LogoutButton />
      </div>
    </aside>
  );
}
