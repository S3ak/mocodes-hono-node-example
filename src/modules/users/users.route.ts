import { Hono } from "hono";
import type { Users } from "./users.ts";
import { pool } from "../../db/mySQL/database.js";

const users = new Hono();

users.get("/", async (c) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM users`);
    let newUsers = rows as Users[];

    return c.json(newUsers);
  } catch (error) {
    return c.text(error?.message || "Something went wrong", 400);
  }
});

export default users;
