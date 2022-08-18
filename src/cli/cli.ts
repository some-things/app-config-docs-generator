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
  .option("-p, --path <path>", "local path", "tmp")
  .option("-b, --branch <branch>", "git branch", "v2.3.0")
  .action((options) => {
    generate(options.repository, options.path, options.branch);
  });

program
  .command("clean")
  .description("Remove all generated files")
  .option("-p, --path <path>", "local path", "./tmp")
  .action((options) => {
    clean(options.path);
  });
