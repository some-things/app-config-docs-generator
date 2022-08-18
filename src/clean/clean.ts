import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

export const clean = async () => {
  const dirToClean = path.join(process.cwd(), "tmp");

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
