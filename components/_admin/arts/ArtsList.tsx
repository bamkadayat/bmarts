"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts, deleteProduct } from "@/store/slices/artsSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiLoader3Fill } from "react-icons/ri";

export default function ArtsList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.arts
  );

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this art?")) {
      dispatch(deleteProduct({ id }));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/arts/edit-art?id=${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 text-primary rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Arts List</h2>
        <button
          onClick={() => router.push("/dashboard/arts/add-art")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Add New Art
        </button>
      </div>

      {/* Table */}
      <div className="overflow-y-auto min-h-[300px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent text-primary">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="flex items-center justify-center">
                    <RiLoader3Fill
                      size={20}
                      color="gray"
                      className="animate-spin mr-2"
                    />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No arts available.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id || index}>
                  <td className="p-3">{product.title}</td>
                  <td className="p-3">
                    <div className="w-[40px] h-[40px] relative">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          className="object-cover rounded"
                          width={40}
                          height={40}
                          style={{
                            objectFit: "cover",
                            width: "40px",
                            height: "40px",
                          }}
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 text-center relative">
                    {/* Actions Dropdown */}
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === product.id ? null : product.id
                          )
                        }
                        className="text-primary text-xl focus:outline-none"
                      >
                        &#x22EE;
                      </button>

                      {dropdownOpen === product.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-50 overflow-visible">
                          <ul className="py-1 text-sm text-gray-300">
                            <li>
                              <button
                                onClick={() => handleEdit(product.id)}
                                className="block px-4 py-2 hover:bg-gray-700 hover:text-white w-full text-left"
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="block px-4 py-2 hover:bg-gray-700 hover:text-white w-full text-left text-red-500"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
