"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUsers, deleteUser } from "@/store/slices/usersSlice";
import { AppDispatch } from "@/store";
import DataGrid, { SortColumn, Column } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { RiLoader3Fill } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserLists() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(selectUsers);

  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(users)) {
      applyFilters();
    }
  }, [users, searchQuery]);

  const columns: Column<Row>[] = [
    { key: "id", name: "ID", sortable: true },
    { key: "name", name: "Name", sortable: true },
    { key: "email", name: "Email", sortable: true },
    { key: "role", name: "Role", sortable: true },
    {
      key: "actions",
      name: "Actions",
      renderCell: ({ row }: { row: Row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="bg-red-900 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
      width: 200,
    },
  ];

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/edit-user?id=${user.id}`);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(user.id));
    }
  };

  const sortRows = (rows: Row[], sortColumns: SortColumn[]) => {
    if (sortColumns.length === 0) return rows;

    const [{ columnKey, direction }] = sortColumns;
    const sortedRows = [...rows].sort((a, b) => {
      const aValue = a[columnKey as keyof Row];
      const bValue = b[columnKey as keyof Row];

      if (aValue == null && bValue != null) return -1;
      if (aValue != null && bValue == null) return 1;
      if (aValue == null && bValue == null) return 0;

      return aValue > bValue ? 1 : -1;
    });

    return direction === "DESC" ? sortedRows.reverse() : sortedRows;
  };

  const applyFilters = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = Array.isArray(users)
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowercasedQuery) ||
            user.email.toLowerCase().includes(lowercasedQuery)
        )
      : [];
    setFilteredRows(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortColumns: SortColumn[]) => {
    setSortColumns(newSortColumns);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <div className="flex justify-between mb-4 align-middle">
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-[280px] p-2 border rounded text-primary"
          />
        </div>
        <div>
          <Link href="/dashboard/users/add-user">
            <button className="bg-primary p-2 rounded-md text-white">
              Add User
            </button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b">
          <DataGrid
            columns={columns}
            rows={loading ? [] : sortRows(filteredRows, sortColumns)}
            sortColumns={sortColumns}
            onSortColumnsChange={handleSortChange}
            className="rdg-light"
            rowHeight={35}
            headerRowHeight={50}
          />
          {loading && (
            <div className="flex items-center justify-center bg-white py-4">
              <RiLoader3Fill
                size={20}
                color="gray"
                className="animate-spin mr-2"
              />
              <span>Loading users...</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-center text-red-500 mt-4">Error: {error}</p>}
      {!loading && !filteredRows.length && (
        <p className="text-center text-gray-500 mt-4">No users found.</p>
      )}
    </div>
  );
}
