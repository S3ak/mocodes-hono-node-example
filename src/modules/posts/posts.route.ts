import { Hono } from "hono";
import type { PostWithUser, PostsWithUserResponse } from "./posts.js";
import { pool } from "../../db/mySQL/database.js";

// We define our new base route as app
const posts = new Hono();

posts.get("/", async (c) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.user_id,
        posts.created_at,
        users.username,
        users.email
      FROM posts 
      INNER JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);

    const postsData = rows as PostWithUser[];

    return c.json({
      ok: true,
      message: "fetched posts successfully",
      data: postsData,
      meta: {
        // #TODO
        total: 100,
        limit: 0,
        skip: 0,
      },
    });
  } catch (error) {
    return c.text("Failed to fetch posts", 400);
  }
});

export default posts;
