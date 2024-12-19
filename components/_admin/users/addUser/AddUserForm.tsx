"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createUser } from "@/store/slices/usersSlice";
import { useRouter } from "next/navigation";

// Define validation schema
const addUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role must be USER or ADMIN" }),
  }),
  emailVerified: z.boolean(),
});

// Infer the form data type from the schema
type AddUserFormData = z.infer<typeof addUserSchema>;

export default function AddUserForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
  });

  const onSubmit = async (data: AddUserFormData) => {
    try {
      await dispatch(createUser(data)).unwrap();
      alert("User created successfully!");
      reset(); // Reset the form after successful submission
    } catch (error) {
      alert(`Failed to create user: ${error}`);
    }
  };
  const handleCancel = () => {
    router.push("/dashboard/users");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full px-3 py-2 border rounded"
          type="text"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          className="w-full px-3 py-2 border rounded"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          {...register("password")}
          className="w-full px-3 py-2 border rounded"
          type="password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a role</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Email Verified */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="emailVerified">
          Email Verified
        </label>
        <input
          id="emailVerified"
          {...register("emailVerified")}
          type="checkbox"
          className="mr-2"
        />
        Mark as verified
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
      <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
    </div>
  );
}
