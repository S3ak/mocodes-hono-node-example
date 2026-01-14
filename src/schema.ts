import { z } from "@hono/zod-openapi";

export const MetaSchema = z.object({
  total: z.number().int().nonnegative().openapi({
    example: 100,
    description: "Total number of items",
  }),
  limit: z.number().int().positive().openapi({
    example: 10,
    description: "Number of items per page",
  }),
  skip: z.number().int().nonnegative().openapi({
    example: 0,
    description: "Number of items skipped",
  }),
});
