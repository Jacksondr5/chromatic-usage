"use server";

import { ChromaticBuild, parseChromaticCsv } from "~/parseChromaticCsv";
import { db } from "~/database";

export async function loadFile(builds: ChromaticBuild[]): Promise<void> {
  const statements = builds.map(
    (
      {
        appId,
        appName,
        branch,
        buildId,
        buildNumber,
        chromeSnapshots,
        date,
        edgeSnapshots,
        firefoxSnapshots,
        internetExplorerSnapshots,
        repositorySlug,
        safariSnapshots,
        skippedSnapshots,
      },
      index,
    ) => {
      const statement = `(${appId}, ${appName}, ${branch}, ${buildId}, ${buildNumber}, ${chromeSnapshots}, ${date}, ${edgeSnapshots}, ${firefoxSnapshots}, ${internetExplorerSnapshots}, ${repositorySlug}, ${safariSnapshots}, ${skippedSnapshots}),\n`;
      if (index === 0)
        return `INSERT INTO chromatic (appId, appName, branch, buildId, buildNumber, chromeSnapshots, date, edgeSnapshots, firefoxSnapshots, internetExplorerSnapshots, repositorySlug, safariSnapshots, skippedSnapshots) VALUES ${statement}`;
      if (index === builds.length - 1) return statement.slice(0, -2);
      return statement;
    },
  );
  db.exec(statements.join(""));
}
