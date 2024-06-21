import {
  type ChromaticCsv,
  ParseErrorMessages,
  parseChromaticCsv,
} from "../parseChromaticCsv";

const csvHeader =
  "Date,App ID,Build ID,Repository slug,Branch name,Build number,Skipped snapshots,Chrome snapshots,Firefox snapshots,Internet Explorer snapshots,Safari snapshots,Edge snapshots";
const s = (value?: string | number, omitComma = false) =>
  `${value ?? ""}${omitComma ? "" : ","}`;
type TestChromaticCsv = Partial<Omit<ChromaticCsv, "date">> & { date?: string };
const buildCsv = (data: TestChromaticCsv[]) => {
  const csvData = data
    .map(
      (x) =>
        s(x.date) +
        s(x.appId) +
        s(x.buildId) +
        s(x.repositorySlug) +
        s(x.branch) +
        s(x.buildNumber) +
        s(x.skippedSnapshots) +
        s(x.chromeSnapshots) +
        s(x.firefoxSnapshots) +
        s(x.internetExplorerSnapshots) +
        s(x.safariSnapshots) +
        s(x.edgeSnapshots, true),
    )
    .join("\n");
  return `${csvHeader}\n${csvData}`;
};
describe("parseChromaticCsv", () => {
  it("should return an empty array when no data is present", () => {
    const csv = csvHeader;
    const result = parseChromaticCsv(csv);
    expect(result).toEqual([]);
  });
  it("should parse a full row of data", () => {
    const csv = buildCsv([
      {
        date: "2024-06-03 05:08:44",
        appId: "123",
        buildId: "456",
        repositorySlug: "jacksondr5/chromatic-usage",
        branch: "main",
        buildNumber: 1,
        skippedSnapshots: 2,
        chromeSnapshots: 3,
        firefoxSnapshots: 4,
        internetExplorerSnapshots: 5,
        safariSnapshots: 6,
        edgeSnapshots: 7,
      },
    ]);
    const result = parseChromaticCsv(csv);
    expect(result).toEqual([
      {
        date: "2024-06-03 05:08:44",
        appId: "123",
        buildId: "456",
        repositorySlug: "jacksondr5/chromatic-usage",
        branch: "main",
        buildNumber: 1,
        skippedSnapshots: 2,
        chromeSnapshots: 3,
        firefoxSnapshots: 4,
        internetExplorerSnapshots: 5,
        safariSnapshots: 6,
        edgeSnapshots: 7,
      },
    ]);
  });
  it("should handle optional values", () => {
    const csv = buildCsv([
      {
        date: "2024-06-03 05:08:44",
        appId: "123",
        buildId: "456",
        repositorySlug: "jacksondr5/chromatic-usage",
        branch: "main",
        buildNumber: 1,
      },
    ]);
    const result = parseChromaticCsv(csv);
    expect(result).toEqual([
      {
        date: "2024-06-03 05:08:44",
        appId: "123",
        buildId: "456",
        repositorySlug: "jacksondr5/chromatic-usage",
        branch: "main",
        buildNumber: 1,
        skippedSnapshots: 0,
        chromeSnapshots: 0,
        firefoxSnapshots: 0,
        internetExplorerSnapshots: 0,
        safariSnapshots: 0,
        edgeSnapshots: 0,
      },
    ]);
  });
  it("should throw if there are no header values", () => {
    const csv = "";
    expect(() => parseChromaticCsv(csv)).toThrow(ParseErrorMessages.NoHeader);
  });
  it("should throw if the expected header values are not present", () => {
    const csv = buildCsv([
      {
        date: "2024-06-03 05:08:44",
        appId: "123",
        buildId: "456",
        repositorySlug: "jacksondr5/chromatic-usage",
        branch: "main",
        buildNumber: 1,
      },
    ]);
    const csvWithBadHeader = csv.replace("Date", "BAD");
    expect(() => parseChromaticCsv(csvWithBadHeader)).toThrow(
      ParseErrorMessages.MissingExpectedHeaders(["Date"]),
    );
  });
});
