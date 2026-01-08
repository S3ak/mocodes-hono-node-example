import { z } from "zod";
import { GamesSchema } from "./games.schema.ts";

// import type { Meta } from "../../types.js";

export type GamesResponse = z.infer<typeof GamesSchema>;
export type Games = z.infer<typeof GamesSchema>;
