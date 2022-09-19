import { readdir } from 'fs/promises';
import { join } from 'path';

export const getApplicationRepositoryApplicationNames = async (
  repositoryPath: string
): Promise<string[]> => {
  const applicationDirectories = await readdir(
    join(repositoryPath, "services"),
    {
      withFileTypes: true,
    }
  ).then((f) => f.filter((f) => f.isDirectory()));

  const applicationNames = applicationDirectories.map((d) => d.name);

  return applicationNames;
};
