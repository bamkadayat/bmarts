"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUsers, selectUsers } from "@/store/slices/usersSlice";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

// Schema with optional password
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserProps {
  userId: string;
}

export default function EditUser({ userId }: EditUserProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector(selectUsers);
  const router = useRouter();

  // Find user data for the given ID
  const user = users.find((user) => user.id === userId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? { name: user.name, email: user.email, role: user.role }
      : undefined,
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, role: user.role });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      ) as Partial<UserFormData>;
  
      const updatedUser: { id: string } & Partial<UserFormData> = {
        id: userId,
        ...filteredData,
      };
  
      await dispatch(updateUser(updatedUser));
      await dispatch(fetchUsers()); // Refresh user list
      alert("User updated successfully!");
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };
  

  if (!user) {
    return <p className="text-red-500">User not found!</p>;
  }

  const handleCancel = () => {
    router.push("/dashboard/users");
  };

  return (
    <div className="space-y-6 p-6 bg-bg-dashboardLight max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4 text-white">Edit User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white">Name</label>
          <input
            {...register("name")}
            className={`w-full px-3 py-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            {...register("email")}
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-white">Role</label>
          <select
            {...register("role")}
            className={`w-full px-3 py-2 border rounded ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Role</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white">
            Password (optional)
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Leave blank to keep current password"
            className={`w-full px-3 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-gray-200 hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
