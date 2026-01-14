import { z } from "@hono/zod-openapi";
import { dateToString } from "../../utils/date.js";

export const GAME_GENRES = ["RPG", "Action", "FPS"] as const;

export const GamesSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(256),
  genre: z.enum(GAME_GENRES),
  release: z.date().transform(dateToString),
  price: z.number().positive().max(60.0).transform(toNormalPrice),
  rating: z.number().int().min(0).max(5),
});

export const GamesResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(GamesSchema),
});

function toNormalPrice(price: Number) {
  return parseFloat(price.toFixed(2));
}
