import { Hono } from "hono";
import type { Users } from "./users.ts";
import { pool } from "../../db/mySQL/database.js";
import { zValidator } from "../../utils/validator-wrapper.js";
import {
  newUserFormSchema,
  updateUserFormSchema,
  sortUsersSchema,
} from "./users.schema.js";

// We define our new base route as app
const users = new Hono();

// We chain all of our roots off the user Hono app.
users
  .get("/", zValidator("query", sortUsersSchema), async (c) => {
    const { dir, sortBy, limit = 30 } = c.req.query();
    try {
      let sqlQueryString = "SELECT * FROM users";
      let sqlCountString = "SELECT COUNT(*) FROM users";

      if (sortBy) {
        sqlQueryString += ` ORDER BY ${sortBy}`;
      }

      // NOTE: Dir doesn't work with out a sortBy
      if (sortBy && dir) {
        sqlQueryString += ` ${dir.toUpperCase()}`;
      }

      if (limit) {
        sqlQueryString += ` LIMIT ${limit}`;
      }

      // We query our database
      const [rows, x] = await pool.execute(sqlQueryString);
      const [countRowResult] = await pool.execute(sqlCountString);

      let newUsers = rows as Users[];
      let countRow = countRowResult as {
        "COUNT(*)": number;
      }[];

      const total = countRow[0]["COUNT(*)"];

      // We return a JSON response for our front-end webapp to use.
      return c.json({
        ok: true,
        message: "Fetch users successfully",
        data: newUsers,
        // Our pagination infomation goes here
        meta: {
          total,
          skip: 0,
          limit: Number(limit),
        },
      });
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

    try {
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
    } catch (error) {
      return c.text(
        (error as Error)?.message || "Failed to create a new user",
        400
      );
    }
  })
  .put("/:id", zValidator("form", updateUserFormSchema), async (c) => {
    const { username, email } = c.req.valid("form");
    const { id } = c.req.param();
    let newResults = {
      email: {},
      username: {},
    };

    if (email) {
      try {
        const [emailResult] = await pool.execute(
          `UPDATE users SET email = ? WHERE id = ?`,
          [email, id]
        );
        newResults.email = emailResult;
      } catch (error) {
        c.text(
          (error as Error)?.message ||
            "Failed to update the user, Something is wrong with email",
          400
        );
      }
    }

    if (username) {
      try {
        const [usernameResult] = await pool.execute(
          `UPDATE users SET username = ? WHERE id = ?`,
          [username, id]
        );
        newResults.username = usernameResult;
      } catch (error) {
        c.text(
          (error as Error)?.message ||
            "Failed to update the user, , Something is wrong with username",
          400
        );
      }
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
      const [findResult, y] = await pool.execute(
        `SELECT FROM users WHERE id = ?`,
        [id]
      );

      // #TODO: First find the user then delete the user;

      const [result, x] = await pool.execute(`DELETE FROM users WHERE id = ?`, [
        id,
      ]);

      return c.text(`user with id:${id} was deleted successfully`);
    } catch (error) {
      return c.text("Could not delete user", 404);
    }
  });

export default users;
