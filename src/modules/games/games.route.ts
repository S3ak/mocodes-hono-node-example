import { Hono } from "hono";
import { mockGames } from "./games.factory.js";
import type { Games } from "./games.js";
import { zValidator } from "../../utils/validator-wrapper.js";
import { z } from "zod";
import { GAME_GENRES } from "./games.schema.js";

const games = new Hono();

const filterSchema = z.object({
  genre: z.enum(GAME_GENRES).optional(),
  maxPrice: z.coerce.number().min(0).default(60).optional(),
  sort: z.enum(["asc", "desc"]).default("asc").optional(),
});

games
  .get("/", zValidator("query", filterSchema), (c) => {
    const { maxPrice, genre } = c.req.valid("query");
    let newGames = mockGames;

    // #TODO: GET /games?genre=action&maxPrice=60 - Combine genre and price filters.
    if (genre) {
      newGames = filterByGenre(newGames, genre);
    }

    if (maxPrice) {
      newGames = filterByMaxPrice(newGames, maxPrice);
    }

    // #TODO: GET /games?genre=action&maxPrice=60 - Combine genre and price filters.
    // #TODO: GET /games?sort=rating - Sort games by rating (highest first).
    // #TODO GET /games?year=2023 - Filter games by release year.

    return c.json(newGames);
  })
  .get("/:id", (c) => {
    const { id } = c.req.param();

    const foundGame = mockGames.find((game) => game.id === id);
    if (!foundGame) return c.text("This game doesn't exist", 404);

    return c.json(foundGame);
  })
  .get("/genre/:genre", (c) => {
    const { genre } = c.req.param();

    const foundGames = filterByGenre(mockGames, genre);

    if (!foundGames || foundGames.length === 0)
      return c.text("Could not found games", 404);
    return c.json(foundGames);
  });

function filterByMaxPrice(games: Games[], maxPrice: number) {
  return games.filter(({ price }) => price < maxPrice);
}

function filterByGenre(games: Games[], genre: string) {
  return games.filter(
    (game) => game.genre.toLowerCase() === genre.toLowerCase()
  );
}

export default games;
