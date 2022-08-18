import { existsSync } from 'fs';

import { git } from '.';

export const clone = (repoPath: string, localPath: string, branch: string) => {
  console.log(`Cloning ${repoPath} branch ${branch} to ${localPath}`);

  if (existsSync(localPath)) {
    // TODO: add prompt and/or flag to force overwrite
    console.log(`${localPath} directory already exists, skipping clone`);
    console.log(`Hint: Try running 'clean' first`);
    return;
  }

  git.clone(repoPath, localPath, { "--branch": branch }, (error) => {
    if (error) throw error;
    console.log("Successfully cloned");
  });
};
