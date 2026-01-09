import { z } from "@hono/zod-openapi";

export const UsersSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().max(255),
});
