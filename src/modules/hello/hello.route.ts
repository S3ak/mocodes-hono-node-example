import { Hono } from "hono";
import { env } from "hono/adapter";

const hello = new Hono().get("/", (c) => {
  const { NAME } = env<{ NAME: string }>(c);

  return c.text(`hello ${NAME}!`);
});

export default hello;
