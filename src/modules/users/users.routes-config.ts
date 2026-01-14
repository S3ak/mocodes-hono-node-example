import { createRoute, z } from "@hono/zod-openapi";
import {
  UsersSchema,
  usersAPIResponseSchema,
  newUserFormSchema,
  updateUserFormSchema,
  sortUsersSchema,
} from "./users.schema.js";

// Route: GET /users - List all users with pagination
export const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: sortUsersSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: usersAPIResponseSchema,
        },
      },
      description: "Retrieve all users with pagination",
    },
    400: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to fetch users",
    },
  },
  tags: ["Users"],
  summary: "List all users",
  description: "Get a paginated list of users with optional sorting",
});

// Route: GET /users/:id - Get a single user by ID
export const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "1",
        description: "User ID",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            data: z.array(UsersSchema),
          }),
        },
      },
      description: "Retrieve a single user",
    },
    400: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to fetch user",
    },
  },
  tags: ["Users"],
  summary: "Get user by ID",
  description: "Retrieve a single user by their ID",
});

// Route: POST /users - Create a new user
export const createUserRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/x-www-form-urlencoded": {
          schema: newUserFormSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            data: z.object({
              result: z.any(),
              fields: z.any(),
            }),
          }),
        },
      },
      description: "User created successfully",
    },
    400: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to create user",
    },
  },
  tags: ["Users"],
  summary: "Create a new user",
  description: "Create a new user with username and email",
});

// Route: PUT /users/:id - Update a user
export const updateUserRoute = createRoute({
  method: "put",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "1",
        description: "User ID",
      }),
    }),
    body: {
      content: {
        "application/x-www-form-urlencoded": {
          schema: updateUserFormSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            data: z.object({
              result: z.any(),
            }),
          }),
        },
      },
      description: "User updated successfully",
    },
    400: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to update user",
    },
  },
  tags: ["Users"],
  summary: "Update user",
  description: "Update user's username and/or email",
});

// Route: DELETE /users/:id - Delete a user
export const deleteUserRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "1",
        description: "User ID",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "User deleted successfully",
    },
    404: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "User not found",
    },
    500: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to delete user",
    },
  },
  tags: ["Users"],
  summary: "Delete user",
  description: "Delete a user by ID",
});

// Route: GET /users/:id/posts - Get posts by user
export const getUserPostsRoute = createRoute({
  method: "get",
  path: "/{id}/posts",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "1",
        description: "User ID",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            message: z.string(),
            data: z.array(z.any()), // You may want to create a PostSchema
          }),
        },
      },
      description: "Retrieve all posts from a user",
    },
    400: {
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
      description: "Failed to fetch posts",
    },
  },
  tags: ["Users"],
  summary: "Get user's posts",
  description: "Retrieve all posts created by a specific user",
});
