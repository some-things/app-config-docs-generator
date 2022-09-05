import { createWriteStream } from 'fs';
import { get } from 'https';

export const downloadHelmChart = (
  chartName: string,
  chartVersion: string,
  chartRepoURL: string
) => {
  // TODO: make sure // doesn't break things here
  const chartFilename = `${chartName}-${chartVersion}.tgz`;
  const chartURL = `${chartRepoURL}/${chartFilename}`;

  console.log(`Downloading ${chartURL}`);

  get(chartURL, (res) => {
    const writeStream = createWriteStream(chartFilename);

    res.pipe(writeStream);

    writeStream.on("finish", () => {
      writeStream.close();
      console.log(`Downloaded ${chartFilename}`);
    });
  });
};
