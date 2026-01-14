import { z } from "@hono/zod-openapi";
import { MetaSchema } from "../../schema.js";

export const UsersSchema = z
  .object({
    id: z.number().openapi({
      example: 1,
      description: "User ID",
    }),
    username: z.string().openapi({
      example: "johndoe",
      description: "Username",
    }),
    email: z.string().max(255).openapi({
      example: "john@example.com",
      description: "User email address",
    }),
  })
  .openapi("User");

export const newUserFormSchema = z.object({
  username: z.string().min(2).max(256).openapi({
    example: "johndoe",
    description: "Username for the new user",
  }),
  email: z.email().openapi({
    example: "john@example.com",
    description: "Email address for the new user",
  }),
});

export const updateUserFormSchema = newUserFormSchema.partial();

const SORT_BY_OPTIONS = ["username", "email", "id"] as const;

export const sortUsersSchema = z.object({
  sortBy: z.enum(SORT_BY_OPTIONS).optional().openapi({
    example: "username",
    description: "Field to sort by",
  }),
  dir: z.enum(["desc", "asc"]).optional().openapi({
    example: "asc",
    description: "Sort direction",
  }),
  // #TODO: pages must be numbers that start from 1
  page: z.string().optional().openapi({
    example: "1",
    description: "Page number",
  }),
  // #TODO: limit must be a number that starts from 1 and a max of 150.
  limit: z.string().optional().openapi({
    example: "10",
    description: "Number of items per page",
  }),
});

export const usersAPIResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(UsersSchema),
  meta: MetaSchema,
});
