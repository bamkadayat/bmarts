"use client";

import { useSearchParams } from "next/navigation";
import EditUser from "@/components/_admin/users/editUser/EditUser"
export default function EditUserPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  if (!userId) {
    return <p className="text-red-500">User ID is missing!</p>;
  }

  return (
    <div>
      <EditUser userId={userId} />
    </div>
  );
}
