import { z } from "@hono/zod-openapi";

export const MetaSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  count: z.number().int().nonnegative(),
});
