import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
// Schema for registering a user
export const registerUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
});

// Schema for the parameters (if needed for the delete route)
export const userIdSchema = z.object({
  id: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchemaJson = zodToJsonSchema(loginSchema, {
  target: "openApi3",
});

// Convert the Zod schema to JSON schema
export const registerUserJsonSchema = zodToJsonSchema(registerUserSchema, {
  target: "openApi3",
});

export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema, {
  target: "openApi3",
});

export const userIdJsonSchema = zodToJsonSchema(userIdSchema, {
  target: "openApi3",
});
