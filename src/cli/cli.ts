import { Command } from 'commander';

import { clean } from '../clean';
import { generate } from '../generate';

export const program = new Command();

program
  .name("app-config-docs-generator")
  .description("CLI to generate app config documentation")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate app config documentation")
  .option(
    "-r, --repository <repo-url>",
    "application Git repository URL",
    "https://github.com/mesosphere/kommander-applications"
  )
  // .option("-p, --path <path>", "local path", "./tmp")
  .option("-b, --branch <branch>", "git branch", "v2.3.0")
  .option(
    "-c, --helm-chart-repository-path <path>",
    "local helm chart repository path",
    "common/helm-repositories"
  )
  // TODO: fix this so everything doesn't get dumped into the working directory
  .option("-w, --work-dir <path>", "work directory", "./work")
  .option("-g, --generated-path <path>", "generated files path", "./generated")
  .action(async (options) => {
    await generate(
      options.repository,
      // options.path,
      options.branch,
      options.helmChartRepositoryPath,
      options.workDir,
      options.generatedPath
    );
  });

program
  .command("clean")
  .description(
    "Remove all artifacts and generated files from the current directory"
  )
  .action(async () => {
    await clean();
  });
