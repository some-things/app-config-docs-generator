import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';

export const clean = async () => {
  const dirsToClean = [
    join(process.cwd(), "work"),
    join(process.cwd(), "generated"),
  ];

  for (const dir of dirsToClean) {
    if (existsSync(dir)) {
      console.log("Cleaning directory: ", dir);
      try {
        await rm(dir, { recursive: true });
      } catch (error) {
        console.error("Error cleaning " + dir + ": " + error);
      }
      console.log("Successfully cleaned: ", dir);
    } else {
      console.log("Directory " + dir + " does not exist, skipping");
    }
  }
};
