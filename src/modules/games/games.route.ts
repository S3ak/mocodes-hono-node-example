import { Hono } from "hono";
import { mockGames } from "./games.factory.js";

const games = new Hono();

games
  .get("/", (c) => {
    const { maxPrice } = c.req.query();
    let newGames = mockGames;

    if (maxPrice) {
      newGames = mockGames.filter((game) => game.price < maxPrice);
    }

    // #TODO: GET /games?genre=action&maxPrice=60 - Combine genre and price filters.

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

    const foundGames = mockGames.filter((game) => {
      return game.genre.toLocaleLowerCase() === genre.toLocaleLowerCase();
    });

    if (!foundGames || foundGames.length === 0)
      return c.text("Could not found games", 404);
    return c.json(foundGames);
  });

export default games;
