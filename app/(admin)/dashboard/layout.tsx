import DashboardSideNav from "@/components/_admin/DashboardSideNav";
import AdminStoreProvider from "./adminStoreProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStoreProvider>
      <div className="flex min-h-screen bg-black">
        {/* Sidebar */}
        <DashboardSideNav />

        {/* Main Content */}
        <div className="ml-64 w-full bg-dashboardLight">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminStoreProvider>
  );
}
