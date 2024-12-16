import Link from "next/link";
import LogoutButton from "@/components/users/logout/LogoutButton";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col h-screen fixed">
        <div className="p-4 text-2xl font-semibold border-b border-gray-600">
          Admin Panel
        </div>
        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block py-2 px-4 hover:bg-gray-600 transition rounded-md"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="block py-2 px-4 hover:bg-gray-600 transition rounded-md"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/orders"
                className="block py-2 px-4 hover:bg-gray-600 transition rounded-md"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="block py-2 px-4 hover:bg-gray-600 transition rounded-md"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-600">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 w-full">
        {/* Top Bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <div>
            <span className="text-gray-600">Welcome, Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
