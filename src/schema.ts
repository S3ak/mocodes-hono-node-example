import { z } from "@hono/zod-openapi";

export const MetaSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  skip: z.number().int().nonnegative(),
});
