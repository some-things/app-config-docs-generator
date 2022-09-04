import { readFileSync, Stats } from 'fs';
import path from 'path';
import recursiveReadDir from 'recursive-readdir';
import * as YAML from 'yaml';

import { getApplicationRepositoryApplicationNames } from './applicationRepository';

export const getApplicationHelmReleases = async (
  repositoryPath: string,
  applicationName: string
): Promise<Array<{}>> => {
  const applicationNames = await getApplicationRepositoryApplicationNames(
    repositoryPath
  );

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

  helmReleases.forEach((h) => {
    console.log(`
      name: ${h["metadata"]["name"]}
      repo: ${h["spec"]["chart"]["spec"]["sourceRef"]["name"]}
      version: ${h["spec"]["chart"]["spec"]["version"]} 
    `);
  });

  return helmReleases;
};
