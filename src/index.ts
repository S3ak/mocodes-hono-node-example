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

const BASE_URL = "/api/v1";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
