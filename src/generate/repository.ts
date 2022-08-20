import { readdir } from 'fs/promises';
import path from 'path';

export const getRepositoryApplicationNames = async (
  repositoryPath: string
): Promise<string[]> => {
  const applicationDirectories = await readdir(
    path.join(repositoryPath, "services"),
    {
      withFileTypes: true,
    }
  ).then((f) => f.filter((f) => f.isDirectory()));

  const applicationNames = applicationDirectories.map((d) => d.name);

  return applicationNames;
};
