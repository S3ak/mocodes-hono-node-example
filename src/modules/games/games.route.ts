import { Hono } from "hono";
import { mockGames } from "./games.factory.js";
import type { Games } from "./games.js";

const games = new Hono();

games
  .get("/", (c) => {
    const { maxPrice, genre } = c.req.query();
    let newGames = mockGames;

    if (maxPrice && genre) {
      const filteredByPrice = filterByMaxPrice(mockGames, maxPrice);
      const filteredByGenreNPrice = filterByGenre(filteredByPrice, genre);
      return c.json(filteredByGenreNPrice);
    }

    if (maxPrice) {
      newGames = filterByMaxPrice(mockGames, maxPrice);
      return c.json(newGames);
    }

    // #TODO: GET /games?genre=action&maxPrice=60 - Combine genre and price filters.

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

function filterByMaxPrice(games: Games[], maxPrice: string) {
  return games.filter(({ price }) => price < maxPrice);
}

function filterByGenre(games: Games[], genre: string) {
  return games.filter(
    (game) => game.genre.toLowerCase() === genre.toLowerCase()
  );
}

export default games;
