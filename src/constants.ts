import dotenv from "dotenv";

dotenv.config();

// #TODO: Get from .env
export const BASE_URL = process.env.BASE_URL || "/api/v1";
export const PORT = process.env.PORT || 3000;
