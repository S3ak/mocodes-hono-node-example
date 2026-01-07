import { Hono } from "hono";
import type { Product } from "./products.js";

const products: Product[] = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Headphones", price: 150 },
  { id: "3", name: "Keyboard", price: 80 },
];

export const app = new Hono()
  .get("/", (c) => {
    return c.json(products);
  })
  .get("/:id", (c) => {
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
