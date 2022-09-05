import { existsSync } from 'fs';

import { git } from './client';

export const clone = async (
  repoPath: string,
  localPath: string,
  branch: string
) => {
  if (existsSync(localPath)) {
    // TODO: add prompt and/or flag to force overwrite
    console.log(
      `Directory ${localPath} already exists, skipping clone (hint: try running 'clean' first)`
    );
    return;
  }

  console.log(`Cloning ${repoPath} branch ${branch} to ${localPath}`);

  await git.clone(repoPath, localPath, { "--branch": branch }, (error) => {
    if (error) throw error;
    console.log("Successfully cloned");
  });
};
