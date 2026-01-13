import { z } from "zod";
import {
  PostsSchema,
  PostsWithUserResponseSchema,
  PostWithUserSchema,
} from "./posts.schema.ts";

export type Post = z.infer<typeof PostsSchema>;
export type PostWithUser = z.infer<typeof PostWithUserSchema>;
export type PostsWithUserResponse = z.infer<typeof PostsWithUserResponseSchema>;
