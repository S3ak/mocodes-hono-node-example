import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { LoginSchema, RegisterFormSchema } from "./auth.schema.js";
import { pool } from "../../db/mySQL/database.js";
import type { Users, UsersResponse } from "../users/users.js";
import bcrypt from "bcrypt";
import type { ResultSetHeader } from "mysql2";
import { generateToken } from "../../utils/jwt.js";
// import { jwt } from "hono/jwt";
// import type { JwtVariables } from "hono/jwt";

const auth = new Hono();

// FIXME:
const PASSWORD = process.env.PASSWORD || "fed";
const USERNAME = process.env.USERNAME || "Pa55W0rd!";

auth
  .post("/register", zValidator("form", RegisterFormSchema), async (c) => {
    try {
      const { username, email, password } = c.req.valid("form");

      // #NOTE: Check that if the user already exists in the DB.
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );

      const existingUsers = rows as Users[];

      console.log("existingUsers", existingUsers);

      if (existingUsers.length > 0) {
        return c.text(`User already exists`, 400);
      }

      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user in database
      const [result]: [ResultSetHeader, any] = await pool.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      console.log("result", result);

      const userResponse = {
        id: result.insertId,
        username,
        email,
      };

      return c.json({
        ok: true,
        message: "Registered user successfully",
        data: {
          userResponse,
        },
      });
    } catch {
      return c.json("Failed to register", 400);
    }
  })
  .post("/login", zValidator("form", LoginSchema), async (c) => {
    try {
      const { email, username, password } = c.req.valid("form");

      // Find user by email
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      const users = rows as Users[];

      if (users.length === 0) {
        return c.json(
          {
            ok: false,
            message: "Invalid email or password, try again!",
            error: "Invalid email or password",
          },
          401
        );
      }

      const user = users[0];

      // NOTE: Verify password using bcrypt
      const validPassword = await bcrypt.compare(password, user.password!);

      if (!validPassword) {
        return c.json({
          error: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        token: token,
      };

      return c.json({
        ok: true,
        message: `Welcome ${user.username}`,
        data: userResponse,
        token: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      c.json(
        {
          error: "Failed to log in",
        },
        500
      );
    }
  });

export default auth;
