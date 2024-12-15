"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { editProfile } from "@/store/slices/profileSlice";
import { AppDispatch } from "@/store";
import { User } from "@/types/users/userType";
import { RiLoader3Fill } from "react-icons/ri";

interface ProfileEditFormProps {
  user: Pick<User, "name" | "email">;
  onUpdate: () => void;
}

const optionalEditSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z
      .string()
      .refine((value) => value === "" || value.length >= 8, {
        message: "Password must be at least 8 characters long",
      })
      .refine((value) => value === "" || /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => value === "" || /\d/.test(value), {
        message: "Password must contain at least one number",
      })
      .optional(),
    repeatPassword: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.password ||
      data.password === data.repeatPassword ||
      !data.repeatPassword,
    {
      message: "Passwords do not match",
      path: ["repeatPassword"],
    }
  );

type EditProfileInput = z.infer<typeof optionalEditSchema>;

export default function ProfileEditForm({
  user,
  onUpdate,
}: ProfileEditFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(optionalEditSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: EditProfileInput) => {
    try {
      const formData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== "")
      );

      if (!Object.keys(formData).length) {
        setError("Please modify at least one field before submitting.");
        return;
      }

      await dispatch(editProfile(formData)).unwrap();
      onUpdate();
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          disabled
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Password (Optional)
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="***********"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("repeatPassword")}
          placeholder="***********"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        {errors.repeatPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.repeatPassword.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <RiLoader3Fill size={20} color="white" className="animate-spin mr-3" />
            Submitting...
          </span>
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  );
}
