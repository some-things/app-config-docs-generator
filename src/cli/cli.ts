import { Command } from 'commander';

import { clone } from '../applicationRepositoy';
import { clean } from '../clean';

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
  .option("-b, --branch <branch>", "git branch", "2.3.0")
  .action((options) => {
    console.log(`
    repository: ${options.repository}
    branch: ${options.branch}`);
    clone();
  });

program
  .command("clean")
  .description("Remove all generated files")
  .action(() => {
    clean();
  });
