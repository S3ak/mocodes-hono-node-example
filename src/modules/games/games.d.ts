import { z } from "@hono/zod-openapi";
import { GamesSchema } from "./games.schema.js";

// import type { Meta } from "../../types.js";

export type GamesResponse = z.infer<typeof GamesSchema>;
