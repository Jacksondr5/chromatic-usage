export type ChromaticCsv = {
  appId: string;
  buildId: string;
  date: string;
  repositorySlug: string;
  branch: string;
  buildNumber: number;
  skippedSnapshots: number;
  chromeSnapshots: number;
  firefoxSnapshots: number;
  safariSnapshots: number;
  edgeSnapshots: number;
  internetExplorerSnapshots: number;
};

export type ChromaticBuild = ChromaticCsv & {
  appName: string;
};

export const ParseErrorMessages = {
  MissingExpectedHeaders: (headers: string[]) =>
    `The CSV headers are missing ${headers.join(", ")}`,
  NoHeader: "The CSV headers are missing",
};

const expectedHeaders = [
  "Date",
  "App ID",
  "Build ID",
  "Repository slug",
  "Branch name",
  "Build number",
  "Skipped snapshots",
  "Chrome snapshots",
  "Firefox snapshots",
  "Safari snapshots",
  "Edge snapshots",
  "Internet Explorer snapshots",
] as const;

const keyMap: Record<keyof ChromaticCsv, (typeof expectedHeaders)[number]> = {
  appId: "App ID",
  buildId: "Build ID",
  date: "Date",
  repositorySlug: "Repository slug",
  branch: "Branch name",
  buildNumber: "Build number",
  skippedSnapshots: "Skipped snapshots",
  chromeSnapshots: "Chrome snapshots",
  firefoxSnapshots: "Firefox snapshots",
  safariSnapshots: "Safari snapshots",
  edgeSnapshots: "Edge snapshots",
  internetExplorerSnapshots: "Internet Explorer snapshots",
} as const;

const numericKeys = [
  "buildNumber",
  "skippedSnapshots",
  "chromeSnapshots",
  "firefoxSnapshots",
  "safariSnapshots",
  "edgeSnapshots",
  "internetExplorerSnapshots",
];
const parseValue = (value: string | undefined, key: keyof ChromaticCsv) => {
  // if (key === "date") {
  //   // Date is always defined
  //   return new Date(value!);
  // }
  if (numericKeys.includes(key)) {
    return value ? parseInt(value, 10) : 0;
  }
  return value;
};

export const parseChromaticCsv = (csv: string): ChromaticBuild[] => {
  const rows = csv.split("\n");

  const firstRow = rows.shift();
  if (!firstRow) throw new Error(ParseErrorMessages.NoHeader);
  const headers = firstRow.split(",");

  const missingHeaders = expectedHeaders.filter(
    (header) => !headers.includes(header),
  );
  if (missingHeaders.length > 0) {
    throw new Error(ParseErrorMessages.MissingExpectedHeaders(missingHeaders));
  }
  if (rows.length === 0) return [];
  return rows.map((row) => {
    const values = row.split(",");
    return Object.keys(keyMap).reduce((acc, key) => {
      const csvKey = keyMap[key as keyof ChromaticCsv];
      const index = headers.indexOf(csvKey);
      return {
        ...acc,
        [key]: parseValue(values[index], key as keyof ChromaticCsv),
      };
    }, {} as ChromaticBuild);
  });
};
