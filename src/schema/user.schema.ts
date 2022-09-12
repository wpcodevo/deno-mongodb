import { z } from "../deps.ts";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: "Name is required" }),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email"),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
      passwordConfirm: z.string({
        required_error: "Please confirm your password",
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Passwords do not match",
    }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email or password"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Invalid email or password"),
  }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = z.TypeOf<typeof loginUserSchema>["body"];
