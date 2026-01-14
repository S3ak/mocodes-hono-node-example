import { z } from "@hono/zod-openapi";
import { MetaSchema } from "../../schema.js";

export const UsersSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().max(255),
  password: z.string().max(255),
});

export const UsersSchemaWithoutPasssWord = UsersSchema.omit({
  password: true,
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
  // #TODO: pages must be numbers that start from 1
  page: z.string().optional(),
  // #TODO: limit must be a number that starts from 1 and a max of 150.
  limit: z.string().optional(),
});

export const usersAPIResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(UsersSchemaWithoutPasssWord),
  meta: MetaSchema,
});
