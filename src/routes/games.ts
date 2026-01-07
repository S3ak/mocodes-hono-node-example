import { Hono } from "hono";

const games = new Hono();

games.get("/", (c) => {
  return c.text("games");
});

export default games;
