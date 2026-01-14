import { Hono } from "hono";
import dotenv from "dotenv";

import { BASE_URL } from "./constants.js";
import products from "./modules/products/products.route.js";
import games from "./modules/games/games.route.js";
import users from "./modules/users/users.route.js";
import posts from "./modules/posts/posts.route.js";
import auth from "./modules/auth/auth.route.js";
import hello from "./modules/hello/hello.route.js";
import search from "./modules/search/search.route.js";

dotenv.config();

export const app = new Hono()
  .basePath(BASE_URL)
  .route("/products", products)
  .route("/hello", hello)
  .route("/search", search)
  .route("/games", games)
  .route("/users", users)
  .route("/posts", posts)
  .route("/auth", auth);

export type AppType = typeof app;
