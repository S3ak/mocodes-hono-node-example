import { Hono } from "hono";

import type { Games } from "./games.js";
import { filterSchema, newGameFormSchema } from "./games.schema.js";
import { readData, writeData } from "../../utils/fs.js";
import { zValidator } from "../../utils/validator-wrapper.js";

const DB_FILE = "./data.json";

const games = new Hono()
  .get("/", zValidator("query", filterSchema), async (c) => {
    const { maxPrice, genre } = c.req.valid("query");

    // #TODO wrap in try catch
    let newGames: Games[] = await readData(DB_FILE);

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
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    const allGames: Games[] = await readData(DB_FILE);
    // const allGames: Games[] = await sql`SELECT * FROM gamse WHERE id = ${id};`;

    const foundGame = allGames.find((game) => game.id === id);
    if (!foundGame) return c.text("This game doesn't exist", 404);

    return c.json(foundGame);
  })
  .get("/genre/:genre", async (c) => {
    const { genre } = c.req.param();

    const allGames: Games[] = await readData(DB_FILE);

    const foundGames = filterByGenre(allGames, genre);

    if (!foundGames || foundGames.length === 0)
      return c.text("Could not found games", 404);
    return c.json(foundGames);
  })
  .post("/", zValidator("form", newGameFormSchema), async (c) => {
    const { name, genre, release, price, rating } = c.req.valid("form");
    // const allGames: Games[] = await readData();
    const allGames: Games[] = await readData(DB_FILE);

    let newGames: Games[] = [
      ...allGames,
      {
        id: crypto.randomUUID(),
        name,
        genre,
        release,
        price: Number(price),
        rating: Number(rating),
      },
    ];

    await writeData(DB_FILE, newGames);
    await readData(DB_FILE);

    return c.json(
      {
        ok: true,
        message: "Game created successfully!",
        data: {
          name,
          genre,
          release,
          price,
          rating,
        },
      },
      201
    );
  });

/**
 * Filters games by maximum price.
 * @param games - Array of games to filter
 * @param maxPrice - Maximum price threshold (exclusive)
 * @returns Filtered array of games with price less than maxPrice
 */
function filterByMaxPrice(games: Games[], maxPrice: number) {
  return games.filter(({ price }) => price < maxPrice);
}

/**
 * Filters games by genre (case-insensitive).
 * @param games - Array of games to filter
 * @param genre - Genre name to filter by
 * @returns Filtered array of games matching the specified genre
 */
function filterByGenre(games: Games[], genre: string) {
  return games.filter(
    (game) => game.genre.toLowerCase() === genre.toLowerCase()
  );
}

export default games;
