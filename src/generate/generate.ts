import { clone } from '../git';
import { getApplicationHelmReleases } from './application';
import { downloadHelmChart, extractHelmChart, generateHelmChartDoc } from './helmChart';
import { getHelmRepositoryURL } from './helmRepository';

export const generate = async (
  repository: string,
  path: string,
  branch: string,
  helmChartRepositoryPath: string
) => {
  await clone(repository, path, branch);
  await getApplicationHelmReleases(path, "gatekeeper");
  const helmRepositoryURL = await getHelmRepositoryURL(
    helmChartRepositoryPath,
    "open-policy-agent.github.io-charts"
  );
  await downloadHelmChart("gatekeeper", "3.8.1", helmRepositoryURL);
  await extractHelmChart("gatekeeper-3.8.1.tgz");
  await generateHelmChartDoc(
    "gatekeeper",
    "https://open-policy-agent.github.io/gatekeeper/charts//gatekeeper-3.8.1.tgz"
  );
};
