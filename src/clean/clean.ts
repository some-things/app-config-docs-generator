import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';

export const clean = async (path: string) => {
  const dirToClean = join(process.cwd(), path);

  if (existsSync(dirToClean)) {
    console.log("Cleaning " + dirToClean);
    try {
      await rm(dirToClean, { recursive: true });
    } catch (error) {
      console.error("Error cleaning " + dirToClean + ": " + error);
    }
    console.log("Successfully cleaned " + dirToClean);
  } else {
    console.log("Nothing to clean");
  }
};
