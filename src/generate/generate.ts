import { clone } from '../git';
import { getApplicationHelmReleases } from './application';

export const generate = async (
  repository: string,
  path: string,
  branch: string
) => {
  await clone(repository, path, branch);
  await getApplicationHelmReleases(path, "gatekeeper");
};