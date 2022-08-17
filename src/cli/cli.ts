import { Command } from 'commander';

export const program = new Command();
program
  .name("app-config-docs-generator")
  .description("CLI to generate app config documentation")
  .version("1.0.0");

program
  .command("test")
  .description("Test command description")
  .argument("<string>", "string argument")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });
