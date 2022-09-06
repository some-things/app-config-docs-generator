import { clone } from '../git';
import { getApplicationHelmReleases } from './application';
import { getApplicationRepositoryApplicationNames } from './applicationRepository';
import { downloadHelmChart, extractHelmChart, generateHelmChartDoc } from './helmChart';
import { getHelmRepositoryURL } from './helmRepository';

export const generate = async (
  repository: string,
  path: string,
  branch: string,
  helmChartRepositoryPath: string
) => {
  await clone(repository, path, branch);

  const applications = await getApplicationRepositoryApplicationNames(path);

  applications.forEach(async (a) => {
    const helmReleases = await getApplicationHelmReleases(path, a);

    // const nonLocalHelmReleases = helmReleases.filter(
    //   (hr: any) => !hr.spec.chart.spec.chart.toString().includes(".tgz")
    // );

    // console.log(`${a} helm releases: ${JSON.stringify(nonLocalHelmReleases)}`);

    // TODO: fix type

    helmReleases
      // TODO: fix chartmuseum 'local' chart
      .filter(
        (hr: any) => !hr.spec.chart.spec.chart.toString().includes(".tgz")
      )
      .forEach(async (hr: any) => {
        // TODO: ensure the docs are more specific what is configurable via appdeployments
        const helmReleaseName = hr.spec.chart.spec.chart;
        const helmReleaseRepo = hr.spec.chart.spec.sourceRef.name;
        const helmReleaseVersion = hr.spec.chart.spec.version
          .toString()
          .split("=")
          .pop()
          .split("}")[0];
        const helmReleaseRepositoryURL = await getHelmRepositoryURL(
          helmChartRepositoryPath,
          helmReleaseRepo
        );
        const helmReleaseFileName = `${helmReleaseName}-${helmReleaseVersion}.tgz`;

        await downloadHelmChart(
          helmReleaseName,
          helmReleaseVersion,
          helmReleaseRepositoryURL
        );

        await extractHelmChart(helmReleaseFileName);

        // TODO: need to fix this to get the correct fetch url (see downloadHelmChart)
        await generateHelmChartDoc(
          helmReleaseName,
          `${helmReleaseRepositoryURL}/${helmReleaseFileName}`
        );
      });
  });

  // await getApplicationHelmReleases(path, "gatekeeper");
  // const helmRepositoryURL = await getHelmRepositoryURL(
  //   helmChartRepositoryPath,
  //   "open-policy-agent.github.io-charts"
  // );
  // await downloadHelmChart("gatekeeper", "3.8.1", helmRepositoryURL);
  // await extractHelmChart("gatekeeper-3.8.1.tgz");
  // await generateHelmChartDoc(
  //   "gatekeeper",
  //   "https://open-policy-agent.github.io/gatekeeper/charts//gatekeeper-3.8.1.tgz"
  // );
};
