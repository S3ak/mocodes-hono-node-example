import { serve } from "@hono/node-server";
import { Hono } from "hono";

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

const app = new Hono();

const BASE_URL = "/api/v2";

app.get(`${BASE_URL}/hello`, (c) => {
  return c.text("hello world");
});

// Route Param
app.get(`${BASE_URL}/products/:id`, (c) => {
  const id = c.req.param("id");
  const foundProduct = products.find((product) => product.id === id);
  if (!foundProduct) {
    return c.json(
      {
        error: {
          message: "Not found",
          url: `${BASE_URL}/products/:id`,
        },
      },
      404
    );
  }

  return c.json(foundProduct);
});

// Product resource send all products to client
app.get(`${BASE_URL}/products`, (c) => {
  return c.json(products);
});

// Query Param
app.get(`${BASE_URL}/search`, async (c) => {
  const { sortBy, filterBy } = c.req.query();

  return c.text(`your query is SortBy ${sortBy} & Filter: ${filterBy}`);
});

//  Headers
app.get(`${BASE_URL}/protected`, async (c) => {
  const { Authorization, api_key } = c.req.header();

  if (api_key === "123") {
    return c.json(products);
  }

  return c.text(`You are not authorized`);
});

//  Body
app.post(`${BASE_URL}/auth/login`, async (c) => {
  const body = await c.req.parseBody();

  console.log("body >>>", body);

  return c.text(`You successfully logged in`);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
