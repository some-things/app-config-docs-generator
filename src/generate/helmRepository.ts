import { readFileSync, Stats } from 'fs';
import recursiveReadDir from 'recursive-readdir';
import * as YAML from 'yaml';

export const getHelmRepositoryURL = async (
  repositoryPath: string,
  helmRepository: string
): Promise<string> => {
  const filterYamlFilesFunc = (file: string, stats: Stats) =>
    !stats.isDirectory() && !file.endsWith(".yaml");

  const yamlFiles = await recursiveReadDir(repositoryPath, [
    filterYamlFilesFunc,
  ]);

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

  const helmRepositories = yamlDocs.filter((y) => y.kind === "HelmRepository");

  const helmRepositoryURL = helmRepositories
    .find((h) => h["metadata"]["name"] === helmRepository)
    ["spec"]["url"].split("=")
    .pop()
    .split("}")[0];

  console.log(`helm repo url: ${helmRepositoryURL}`);

  return helmRepositoryURL;
};
