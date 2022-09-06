import axios from 'axios';
import download from 'download';
import { writeFile } from 'fs/promises';
import { userInfo } from 'os';
import { join } from 'path';
import { cwd } from 'process';
import { x } from 'tar';
import * as YAML from 'yaml';

import { isValidUrl } from '../utils/helpers';
import docker from './docker';

export const downloadHelmChart = async (
  chartName: string,
  chartVersion: string,
  chartRepoURL: string
) => {
  // TODO: make sure // doesn't break things here
  const chartFilename = `${chartName}-${chartVersion}.tgz`;
  const chartRepoURLObject = (() => {
    const url = new URL(chartRepoURL);
    return url;
  })();

  console.log(`processing chart repo ${chartRepoURL}`);

  const chartRepoIndex = await (
    await axios.get(`${chartRepoURL}/index.yaml`)
  ).data;

  const chartRepoIndexData = YAML.parse(chartRepoIndex);

  const chartURLs = chartRepoIndexData["entries"][`${chartName}`].filter(
    (c: any) => c.version === chartVersion && c.name === chartName
  )[0]["urls"];

  const chartFetchURL = isValidUrl(chartURLs[0])
    ? chartURLs[0]
    : `${chartRepoURL}/${chartURLs[0]}`;

  try {
    await download(chartFetchURL, cwd());
  } catch (e) {
    console.error(`failed to download ${chartFetchURL}: ${e}`);
  }

  return;
};

export const extractHelmChart = async (chartFilePath: string) => {
  await x({ file: chartFilePath });
};

// https://github.com/norwoodj/helm-docs/blob/master/pkg/document/template.go
export const generateHelmChartDoc = async (
  chartName: string,
  chartURL: string
) => {
  const helmDocsImage = "jnorwood/helm-docs:latest";

  console.log(`Pulling image ${helmDocsImage}`);
  const pullStream = await docker.pull(helmDocsImage);

  console.log("Waiting for image pull to complete");
  await new Promise((res) => docker.modem.followProgress(pullStream, res));
  console.log("Successfully pulled helm-docs image");

  // write unique template file so that we can inject the upstream chart URL
  const templateFileContents = `
{{ template "chart.header" . }}

{{ template "chart.deprecationWarning" . }}

{{ template "chart.badgesSection" . }}

{{ template "chart.description" . }}

{{ template "chart.homepageLine" . }}

{{ template "chart.maintainersSection" . }}

{{ template "chart.sourcesSection" . }}

{{ template "chart.requirementsSection" . }}

{{ template "chart.valuesSection" . }}

### **NOTE:** The values above represent those defined in the chart's default values.yaml file. For any additional configurable values, please download and analyze the chart: ${chartURL}
  `;
  await writeFile("README-d2iq.md.gotmpl", templateFileContents);

  await docker.run(helmDocsImage, [], process.stdout, {
    name: "helm-docs",
    Hostname: "helm-docs",
    Args: [
      "--output-file",
      "README-d2iq.md",
      "--template-files",
      "README-d2iq.md.gotmpl",
      "--document-dependency-values",
    ],
    User: userInfo().uid.toString(),
    Tty: false,
    Cmd: [
      "--output-file",
      "README-d2iq.md",
      "--template-files",
      "README-d2iq.md.gotmpl",
      "--document-dependency-values",
    ],
    Env: [`CHART_URL=${chartURL}`],
    HostConfig: {
      AutoRemove: true,
      RestartPolicy: {
        Name: "no",
        MaximumRetryCount: 0,
      },
      NetworkMode: "default",
      Binds: [
        `${join(cwd(), chartName)}:/helm-docs`,
        `${join(
          cwd(),
          "README-d2iq.md.gotmpl"
        )}:/helm-docs/README-d2iq.md.gotmpl`,
      ],
    },
    Image: helmDocsImage,
  });
};
