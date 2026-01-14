import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import type { Users, UsersResponse } from "./users.ts";
import { pool } from "../../db/mySQL/database.js";
import { zValidator } from "../../utils/validator-wrapper.js";
import {
  newUserFormSchema,
  updateUserFormSchema,
  sortUsersSchema,
} from "./users.schema.js";
import type { PostWithUser } from "../posts/posts.js";
import {
  listUsersRoute,
  getUserRoute,
  createUserRoute,
  updateUserRoute,
  deleteUserRoute,
  getUserPostsRoute,
} from "./users.routes-config.js";

// We define our new base route as app
const users = new OpenAPIHono();

// We chain all of our roots off the user Hono app.
users
  .openapi(listUsersRoute, async (c) => {
    const { dir, sortBy, limit = 10, page = 1 } = c.req.valid("query");

    const formattedLimit = Number(limit);
    const formattedPage = Number(page);
    let sqlQueryString = "SELECT * FROM users";
    let sqlCountString = "SELECT COUNT(*) FROM users";
    const offset = (formattedPage - 1) * formattedLimit;

    try {
      // NOTE: The order matters because SQL has a string format
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

      if (offset) {
        sqlQueryString += ` OFFSET ${offset.toString()}`;
      }

      // NOTE: We query our database
      const [rows] = await pool.execute(sqlQueryString);
      const [countRowResult] = await pool.execute(sqlCountString);

      let newUsers = rows as Users[];
      let countRow = countRowResult as {
        "COUNT(*)": number;
      }[];

      const total = countRow[0]["COUNT(*)"];

      // We return a JSON response for our front-end webapp to use.
      return c.json(
        {
          ok: true,
          message: "Fetch users successfully",
          data: newUsers,
          // Our pagination infomation goes here
          meta: {
            total,
            skip: offset,
            limit: Number(limit),
          },
        },
        200
      );
    } catch (error) {
      return c.text((error as Error)?.message || "Failed to fetch users", 400);
    }
  })
  .openapi(getUserRoute, async (c) => {
    const { id } = c.req.valid("param");
    try {
      const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [
        id,
      ]);
      let newUsers = rows as Users[];

      return c.json(
        {
          ok: true,
          message: "fetched user successfully",
          data: newUsers,
        },
        200
      );
    } catch (error) {
      return c.text((error as Error)?.message || "Failed to fetch users", 400);
    }
  })
  .openapi(createUserRoute, async (c) => {
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
  .openapi(updateUserRoute, async (c) => {
    const { username, email } = c.req.valid("form");
    const { id } = c.req.valid("param");
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

    return c.json(
      {
        ok: true,
        message: "User updated successfully!",
        data: {
          result: newResults,
        },
      },
      200
    );
  })
  .openapi(deleteUserRoute, async (c) => {
    const { id } = c.req.valid("param");

    try {
      // #TODO: First find the user then delete the user;
      const [findResult] = await pool.execute(
        `SELECT FROM users WHERE id = ?`,
        [id]
      );

      if (!findResult) {
        return c.text("User not found", 404);
      }

      const [result, x] = await pool.execute(`DELETE FROM users WHERE id = ?`, [
        id,
      ]);

      return c.text(`user with id:${id} was deleted successfully`, 200);
    } catch (error) {
      return c.text("Failed to delete user", 500);
    }
  })
  .openapi(getUserPostsRoute, async (c) => {
    const { id } = c.req.valid("param");
    try {
      const [rows] = await pool.execute(
        `SELECT 
          posts.id,
          posts.title,
          posts.content,
          posts.user_id,
          posts.created_at
        FROM posts 
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC`,
        [id]
      );

      let postData = rows as PostWithUser[];
      console.log("postData >>>", postData);

      return c.json(
        {
          ok: true,
          message: "fetched posts from user successfully",
          data: postData,
        },
        200
      );
    } catch (error) {
      return c.text((error as Error)?.message || "Failed to fetch posts", 400);
    }
  });

export default users;
