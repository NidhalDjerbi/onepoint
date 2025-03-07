import { z } from "zod";

export const addUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine((val) => {
      const inputDate = new Date(val);
      const today = new Date();
      return inputDate <= today;
    }, "Birthdate cannot be in the future"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine((val) => {
      const inputDate = new Date(val);
      const today = new Date();
      return inputDate <= today;
    }, "Birthdate cannot be in the future"),
});
