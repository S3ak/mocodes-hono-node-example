import { Hono } from "hono";
import type { Product } from "./products.js";
import { validator } from "hono/validator";

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
  })
  .post(
    "/",
    validator("form", (values, c) => {
      console.log("values", values);
      const { name, price } = values;
      // We should convert this values to the proper types
      const formattedPrice = Number(Number(price).toFixed(2));

      // Note: Vanilla validation
      if (!name || !price) {
        return c.text(
          "Could not create product, Please check missing values",
          400
        );
      }

      if (typeof name !== "string") {
        return c.text("Please check the name of the product", 400);
      }

      if (
        typeof formattedPrice !== "number" ||
        formattedPrice < 0 ||
        formattedPrice > 99999
      ) {
        return c.text("Please check the price of the product", 400);
      }

      return c.json(
        {
          ok: true,
          data: {
            id: crypto.randomUUID(),
            name,
            price,
          },
        },
        201
      );
    })
  );
