import { z } from "zod";
import { UsersSchema } from "./users.schema.ts";

export type UsersResponse = z.infer<typeof UsersSchema>;
export type Users = z.infer<typeof UsersSchema>;
