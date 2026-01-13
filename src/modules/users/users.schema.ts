import { z } from "@hono/zod-openapi";

export const UsersSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().max(255),
});

export const newUserFormSchema = z.object({
  username: z.string().min(2).max(256),
  email: z.email(),
});

export const updateUserFormSchema = newUserFormSchema.partial();

const SORT_BY_OPTIONS = ["username", "email", "id"] as const;

export const sortUsersSchema = z.object({
  sortBy: z.enum(SORT_BY_OPTIONS).optional(),
  dir: z.enum(["desc", "asc"]).optional(),
});
