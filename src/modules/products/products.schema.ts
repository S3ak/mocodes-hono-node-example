import { z } from "@hono/zod-openapi";

export const newProductSchema = z.object({
  name: z
    .string()
    .min(2, "Must be longer than 1 character")
    .max(256, "Must be lower than 256 characters"),
  price: z.coerce
    .number()
    .min(0, "Must be greater than or equal to zero")
    .transform((p) => Number(Number(p).toFixed(2))),
});
