import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function makeFullPath(relPath: string = "") {
  return join(__dirname, relPath);
}

// Function to read data from the JSON file
export async function readData(relPath: string) {
  try {
    const data = await readFile(makeFullPath(relPath), "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error, return a default value (e.g., empty array)
    return [];
  }
}

// Function to write data to the JSON file
export async function writeData<T>(relPath: string, data: T[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2); // Use 2 spaces for formatting
    await writeFile(makeFullPath(relPath), jsonString, "utf8");
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}
