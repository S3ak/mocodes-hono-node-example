import { z } from "@hono/zod-openapi";
import { dateToString } from "../../utils/date.js";
import { MetaSchema } from "../../schema.js";

export const PostSchema = z.object({
  id: z.number(),
  title: z.string().max(200),
  content: z.string().optional(),
  user_id: z.number(),
  created_at: z.date().transform(dateToString),
});

export const PostWithUserSchema = PostSchema.extend({
  username: z.string(),
  email: z.email(),
});

export const PostsWithUserResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(PostWithUserSchema),
  meta: MetaSchema,
});
