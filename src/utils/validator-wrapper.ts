/**
 * This is a wrapper around Zod validation so we can send the schema error messages to the front-end
 */

// #TODO: 'ZodSchema' is deprecated.
import type { ZodSchema } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      return c.text(result.error.message, 400);
    }
  });
