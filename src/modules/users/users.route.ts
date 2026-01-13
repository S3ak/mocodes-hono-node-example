import { Hono } from "hono";
import type { Users } from "./users.ts";
import { pool } from "../../db/mySQL/database.js";
import { zValidator } from "../../utils/validator-wrapper.js";
import { z } from "zod";

const users = new Hono();

const newUserFormSchema = z.object({
  username: z.string().min(2).max(256),
  email: z.email(),
});

const updateUserFormSchema = newUserFormSchema.partial();

users
  .get("/", async (c) => {
    try {
      const [rows] = await pool.execute(`SELECT * FROM users`);
      let newUsers = rows as Users[];

      return c.json(newUsers);
    } catch (error) {
      return c.text((error as Error)?.message || "Failed to fetch users", 400);
    }
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    try {
      const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [
        id,
      ]);
      let newUsers = rows as Users[];

      return c.json(newUsers);
    } catch (error) {
      return c.text((error as Error)?.message || "Failed to fetch users", 400);
    }
  })
  .post("/", zValidator("form", newUserFormSchema), async (c) => {
    const { username, email } = c.req.valid("form");

    const [result, fields] = await pool.execute(
      `INSERT INTO users (username, email) VALUES (?, ?);`,
      [username, email]
    );

    return c.json(
      {
        ok: true,
        message: "User created successfully!",
        data: {
          result,
          fields,
        },
      },
      201
    );
  })
  .put("/:id", zValidator("form", updateUserFormSchema), async (c) => {
    const { username, email } = c.req.valid("form");
    const { id } = c.req.param();
    let newResults = {
      email: {},
      username: {},
    };

    if (email) {
      const [emailResult] = await pool.execute(
        `UPDATE users SET email = ? WHERE id = ?`,
        [email, id]
      );
      newResults.email = emailResult;
    }

    if (username) {
      const [usernameResult] = await pool.execute(
        `UPDATE users SET username = ? WHERE id = ?`,
        [username, id]
      );
      newResults.username = usernameResult;
    }

    return c.json({
      ok: true,
      message: "User updated successfully!",
      data: {
        result: newResults,
      },
    });
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    try {
      const [findResult] = await pool.execute(
        `SELECT FROM users WHERE id = ?`,
        [id]
      );

      // #TODO: First find the user then delete the user;

      const [result] = await pool.execute(`DELETE FROM users WHERE id = ?`, [
        id,
      ]);
    } catch (error) {
      return c.text("Could not delete user", 404);
    }

    return c.text(`user ${id} was deleted successfully`);
  });

export default users;
