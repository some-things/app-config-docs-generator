import { join } from 'path';

import { clone } from '../git';
import { getApplicationHelmReleases } from './application';
import { getApplicationRepositoryApplicationNames } from './applicationRepository';
import { downloadHelmChart, extractHelmChart, generateHelmChartDoc } from './helmChart';
import { getHelmRepositoryURL } from './helmRepository';

export const generate = async (
  repository: string,
  // path: string,
  branch: string,
  helmChartRepositoryPath: string,
  workDir: string,
  generatedPath: string
) => {
  const gitRepoLocalPath = join(workDir, "git");
  const artifactsLocalPath = join(workDir, "artifacts");
  await clone(repository, gitRepoLocalPath, branch);

  const applications = await getApplicationRepositoryApplicationNames(
    gitRepoLocalPath
  );

  // use for loop instead of forEach to run sync
  for (const application of applications) {
    // TODO: fix type
    const helmReleases: any = await getApplicationHelmReleases(
      gitRepoLocalPath,
      application
    );

    for (const helmRelease of helmReleases
      // TODO: fix chartmuseum 'local' chart
      .filter(
        (hr: any) => !hr.spec.chart.spec.chart.toString().includes(".tgz")
      )) {
      // TODO: ensure the docs are more specific as to what is configurable via appdeployments (e.g., multi-chart apps)
      const helmReleaseName = helmRelease.spec.chart.spec.chart;
      const helmReleaseRepo = helmRelease.spec.chart.spec.sourceRef.name;
      const helmReleaseVersion = helmRelease.spec.chart.spec.version
        .toString()
        .split("=")
        .pop()
        .split("}")[0];
      const helmReleaseRepositoryURL = await getHelmRepositoryURL(
        join(gitRepoLocalPath, helmChartRepositoryPath),
        helmReleaseRepo
      );
      const helmReleaseFileName = `${helmReleaseName}-${helmReleaseVersion}.tgz`;

      await downloadHelmChart(
        helmReleaseName,
        helmReleaseVersion,
        helmReleaseRepositoryURL,
        artifactsLocalPath
      );

      await extractHelmChart(helmReleaseFileName, artifactsLocalPath);

      // TODO: need to fix this to get the correct fetch url (see downloadHelmChart)
      await generateHelmChartDoc(
        helmReleaseName,
        `${helmReleaseRepositoryURL}/${helmReleaseFileName}`,
        artifactsLocalPath,
        generatedPath
      );
    }
  }
};
