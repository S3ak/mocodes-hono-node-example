import { Hono } from "hono";
import { env } from "hono/adapter";
import dotenv from "dotenv";
import { app as products } from "./modules/products/products.route.js";
import games from "./modules/games/games.route.js";
import users from "./modules/users/users.route.js";
import posts from "./modules/posts/posts.route.js";
import { BASE_URL } from "./constants.js";

dotenv.config();

export const app = new Hono().basePath(BASE_URL);

app.get(`/hello`, (c) => {
  const { NAME } = env<{ NAME: string }>(c);
  console.log("NAME >>>", NAME);

  return c.text(`hello ${NAME}!`);
});

// Query Param
app.get(`/search`, async (c) => {
  const { sortBy, filterBy } = c.req.query();

  return c.text(`your query is SortBy ${sortBy} & Filter: ${filterBy}`);
});

//  Headers
app.get(`/protected`, async (c) => {
  const { api_key } = c.req.header();

  if (api_key === "123") {
    return c.json({ id: 212 });
  }

  return c.text(`You are not authorized`, 401);
});

//  Body
app.post(`/auth/login`, async (c) => {
  const body = await c.req.parseBody();

  console.log("body >>>", body);

  return c.text(`You successfully logged in`);
});

app
  .route("/products", products)
  .route("/games", games)
  .route("/users", users)
  .route("/posts", posts);

export type AppType = typeof app;
