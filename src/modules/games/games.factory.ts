import { faker } from "@faker-js/faker";
import { zocker } from "zocker";
import { GamesSchema } from "./games.schema.js";
import { SEED } from "../../utils/testing.js";

const mockData = zocker(GamesSchema)
  .setSeed(SEED)
  //   .supply(GamesSchema.shape.genre, faker.food.ethnicCategory())
  .generateMany(8);

export const mockGames = mockData;
