import { z } from "@hono/zod-openapi";

export const RegisterFormSchema = z.object({
  email: z.string().max(255),
  username: z.string().max(255),
  password: z.string().max(255),
});

export const LoginSchema = z.object({
  // #TODO: figure out how to have either email or username
  email: z.string().max(255),
  username: z.string().max(255).optional(),
  password: z.string().max(255),
});
