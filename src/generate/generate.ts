import { clone } from '../git';
import { getApplicationHelmReleases } from './application';
import { getHelmRepositoryURL } from './helmRepository';

export const generate = async (
  repository: string,
  path: string,
  branch: string,
  helmChartRepositoryPath: string
) => {
  await clone(repository, path, branch);
  await getApplicationHelmReleases(path, "gatekeeper");
  await getHelmRepositoryURL(
    helmChartRepositoryPath,
    "open-policy-agent.github.io-charts"
  );
};
