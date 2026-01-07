import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import dotenv from "dotenv";

import games from "./routes/games.js";

dotenv.config();

interface Product {
  id: string;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Headphones", price: 150 },
  { id: "3", name: "Keyboard", price: 80 },
];

const BASE_URL = "/api/v1";
const app = new Hono().basePath(BASE_URL);

app.get(`/hello`, (c) => {
  const { NAME } = env<{ NAME: string }>(c);
  console.log("NAME >>>", NAME);

  return c.text(`hello ${NAME}!`);
});

// Route Param
app.get(`/products/:id`, (c) => {
  const id = c.req.param("id");
  const foundProduct = products.find((product) => product.id === id);
  if (!foundProduct) {
    return c.json(
      {
        error: "Product not found",
      },
      404
    );
  }

  return c.json(foundProduct);
});

// Product resource send all products to client
app.get(`/products`, (c) => {
  return c.json(products);
});

// Query Param
app.get(`/search`, async (c) => {
  const { sortBy, filterBy } = c.req.query();

  return c.text(`your query is SortBy ${sortBy} & Filter: ${filterBy}`);
});

//  Headers
app.get(`/protected`, async (c) => {
  const { Authorization, api_key } = c.req.header();

  if (api_key === "123") {
    return c.json(products);
  }

  return c.text(`You are not authorized`, 401);
});

//  Body
app.post(`/auth/login`, async (c) => {
  const body = await c.req.parseBody();

  console.log("body >>>", body);

  return c.text(`You successfully logged in`);
});

app.route("/games", games);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
