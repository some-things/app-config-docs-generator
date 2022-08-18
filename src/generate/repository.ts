import * as fs from 'fs/promises';
import path from 'path';

export const listApplications = async (repositoryPath: string) => {
  const appDirectories = await fs
    .readdir(path.join(repositoryPath, "services"), {
      withFileTypes: true,
    })
    .then((f) => f.filter((f) => f.isDirectory()));

  console.log(appDirectories);
};
