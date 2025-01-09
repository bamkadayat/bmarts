import Link from "next/link";
import LogoutButton from "@/components/users/logout/LogoutButton";
import { FaExternalLinkAlt } from "react-icons/fa";
export default function DashboardSideNav() {
  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen fixed">
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
              className="block py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/arts"
              className="block py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              Arts
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/users"
              className="block py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/orders"
              className="block py-2 px-4 hover:bg-gray-600 transition rounded-md font-semibold text-[18px]"
            >
              Orders
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
