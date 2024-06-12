export type ChromaticCsv = {
  AppId: string;

  BuildId: string;
  Date: Date;
  RepositorySlug: string;
  Branch: string;
  BuildNumber: number;
  SkippedSnapshots: number;
  ChromeSnapshots: number;
  FirefoxSnapshots: number;
  SafariSnapshots: number;
  EdgeSnapshots: number;
  InternetExplorerSnapshots: number;
};

export type ChromaticBuild = ChromaticCsv & {
  AppName: string;
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
  AppId: "App ID",
  BuildId: "Build ID",
  Date: "Date",
  RepositorySlug: "Repository slug",
  Branch: "Branch name",
  BuildNumber: "Build number",
  SkippedSnapshots: "Skipped snapshots",
  ChromeSnapshots: "Chrome snapshots",
  FirefoxSnapshots: "Firefox snapshots",
  SafariSnapshots: "Safari snapshots",
  EdgeSnapshots: "Edge snapshots",
  InternetExplorerSnapshots: "Internet Explorer snapshots",
} as const;

const numericKeys = [
  "BuildNumber",
  "SkippedSnapshots",
  "ChromeSnapshots",
  "FirefoxSnapshots",
  "SafariSnapshots",
  "EdgeSnapshots",
  "InternetExplorerSnapshots",
];
const parseValue = (value: string | undefined, key: keyof ChromaticCsv) => {
  if (key === "Date") {
    // Date is always defined
    return new Date(value!);
  }
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
