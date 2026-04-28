import type { FieldValues } from "react-hook-form";
import { z } from "zod";

export const SigninSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.email("Please, enter a valid email").nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      )
      .nonoptional("Password is required"),
    repeatPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export const LoginSchema = z.object({
  email: z.email("Please, enter a valid email").nonempty("Email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export interface SigninData extends FieldValues {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface LoginData extends FieldValues {
  email: string;
  password: string;
}
