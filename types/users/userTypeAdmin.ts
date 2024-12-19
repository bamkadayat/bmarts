import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  verificationCode?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}
