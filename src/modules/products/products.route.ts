import { Hono } from "hono";
import type { Product } from "./products.js";
import { zValidator } from "../../utils/validator-wrapper.js";
import { newProductSchema } from "./products.schema.js";

const products: Product[] = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Headphones", price: 150 },
  { id: "3", name: "Keyboard", price: 80 },
];

export const productsRoute = new Hono()
  .get("/", (c) => {
    return c.json(products);
  })
  .get("/:id", (c) => {
    //NOTE: We have not validated the paramcoming from the client
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
  .post("/", zValidator("form", newProductSchema), (c) => {
    const { name, price } = c.req.valid("form");
    let newID = crypto.randomUUID();

    // #TODO: Insert new product into the DB
    products.push({
      id: newID,
      name,
      price,
    });

    return c.json(
      {
        ok: true,
        // #NOTE: Trick to get last item in array
        data: products.at(-1),
      },
      201
    );
  });

export default productsRoute;
