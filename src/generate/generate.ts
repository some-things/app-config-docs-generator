import { clone } from '../git';
import { listApplications } from './repository';

export const generate = async (
  repository: string,
  path: string,
  branch: string
) => {
  await clone(repository, path, branch);
  await listApplications(path);
};
