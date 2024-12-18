import DashboardSideNav from "@/components/_admin/DashboardSideNav";
import AdminStoreProvider from "./adminStoreProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStoreProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <DashboardSideNav />

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
    </AdminStoreProvider>
  );
}
