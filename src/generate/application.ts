import { readFileSync, Stats } from 'fs';
import path from 'path';
import recursiveReadDir from 'recursive-readdir';
import * as YAML from 'yaml';

import { getRepositoryApplicationNames } from './repository';

export const getApplicationHelmReleases = async (
  repositoryPath: string,
  applicationName: string
): Promise<Array<{}>> => {
  const applicationNames = await getRepositoryApplicationNames(repositoryPath);

  if (!applicationNames.includes(applicationName)) {
    throw new Error(`Application ${applicationName} not found`);
  }

  const filterYamlFilesFunc = (file: string, stats: Stats) =>
    !stats.isDirectory() && !file.endsWith(".yaml");

  const yamlFiles = await recursiveReadDir(
    path.join(repositoryPath, "services", applicationName),
    [filterYamlFilesFunc]
  );

  const yamlDocs = yamlFiles
    .map((f) => {
      const fileYamlDocs = YAML.parseAllDocuments(readFileSync(f, "utf8")).map(
        (fileYamlDoc) => {
          return YAML.parse(fileYamlDoc.toString());
        }
      );

      return fileYamlDocs;
    })
    .flat();

  const helmReleases = yamlDocs.filter((y) => y.kind === "HelmRelease");

  console.log(helmReleases);

  return helmReleases;
};
