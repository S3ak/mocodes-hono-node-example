import { zocker } from "zocker";
import { GamesSchema } from "./games.schema.js";
import { SEED } from "../../utils/testing.js";

// We create fake data from the schema
const mockData = zocker(GamesSchema).setSeed(SEED).generateMany(8);

export const mockGames = mockData;
