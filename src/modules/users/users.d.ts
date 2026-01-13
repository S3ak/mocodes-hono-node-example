import { z } from "zod";
import { UsersSchema, usersAPIResponseSchema } from "./users.schema.ts";

export type UsersResponse = z.infer<typeof usersAPIResponseSchema>;
export type Users = z.infer<typeof UsersSchema>;
