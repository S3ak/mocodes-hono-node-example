import { z } from "@hono/zod-openapi";

export const GamesSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(256),
  genre: z.literal("rpg"),
  release: z.date().transform(dateToString),
  price: z.number().min(0).max(60.0).transform(toNormalPrice),
  rating: z.number().int().min(0).max(5),
});

function dateToString(date: Date) {
  return date.toISOString();
}

function toNormalPrice(price: Number) {
  return price.toFixed(2);
}
