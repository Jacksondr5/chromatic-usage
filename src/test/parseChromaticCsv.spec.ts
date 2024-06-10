import {
  type ChromaticCsv,
  ParseErrorMessages,
  parseChromaticCsv,
} from "../parseChromaticCsv";

const csvHeader =
  "Date,App ID,Build ID,Repository slug,Branch name,Build number,Skipped snapshots,Chrome snapshots,Firefox snapshots,Internet Explorer snapshots,Safari snapshots,Edge snapshots";
const defaultCsv = `${csvHeader}
5/1/24 8:19,65427034926092d8e9b96c19,6631fb2eab74b00107d1b01f,tbol-com/tbol-core,develop,1998,0,0,0,0,0,`;
const s = (value?: string | number, omitComma = false) =>
  `${value ?? ""}${omitComma ? "" : ","}`;
type TestChromaticCsv = Partial<Omit<ChromaticCsv, "Date">> & { Date?: string };
const buildCsv = (data: TestChromaticCsv[]) => {
  const csvData = data
    .map(
      (x) =>
        s(x.Date) +
        s(x.AppId) +
        s(x.BuildId) +
        s(x.RepositorySlug) +
        s(x.Branch) +
        s(x.BuildNumber) +
        s(x.SkippedSnapshots) +
        s(x.ChromeSnapshots) +
        s(x.FirefoxSnapshots) +
        s(x.InternetExplorerSnapshots) +
        s(x.SafariSnapshots) +
        s(x.EdgeSnapshots, true),
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
        Date: "2024-06-03 05:08:44",
        AppId: "123",
        BuildId: "456",
        RepositorySlug: "jacksondr5/chromatic-usage",
        Branch: "main",
        BuildNumber: 1,
        SkippedSnapshots: 2,
        ChromeSnapshots: 3,
        FirefoxSnapshots: 4,
        InternetExplorerSnapshots: 5,
        SafariSnapshots: 6,
        EdgeSnapshots: 7,
      },
    ]);
    const result = parseChromaticCsv(csv);
    expect(result).toEqual([
      {
        Date: new Date("2024-06-03 05:08:44"),
        AppId: "123",
        BuildId: "456",
        RepositorySlug: "jacksondr5/chromatic-usage",
        Branch: "main",
        BuildNumber: 1,
        SkippedSnapshots: 2,
        ChromeSnapshots: 3,
        FirefoxSnapshots: 4,
        InternetExplorerSnapshots: 5,
        SafariSnapshots: 6,
        EdgeSnapshots: 7,
      },
    ]);
  });
  it("should handle optional values", () => {
    const csv = buildCsv([
      {
        Date: "2024-06-03 05:08:44",
        AppId: "123",
        BuildId: "456",
        RepositorySlug: "jacksondr5/chromatic-usage",
        Branch: "main",
        BuildNumber: 1,
      },
    ]);
    const result = parseChromaticCsv(csv);
    expect(result).toEqual([
      {
        Date: new Date("2024-06-03 05:08:44"),
        AppId: "123",
        BuildId: "456",
        RepositorySlug: "jacksondr5/chromatic-usage",
        Branch: "main",
        BuildNumber: 1,
        SkippedSnapshots: 0,
        ChromeSnapshots: 0,
        FirefoxSnapshots: 0,
        InternetExplorerSnapshots: 0,
        SafariSnapshots: 0,
        EdgeSnapshots: 0,
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
        Date: "2024-06-03 05:08:44",
        AppId: "123",
        BuildId: "456",
        RepositorySlug: "jacksondr5/chromatic-usage",
        Branch: "main",
        BuildNumber: 1,
      },
    ]);
    const csvWithBadHeader = csv.replace("Date", "BAD");
    expect(() => parseChromaticCsv(csvWithBadHeader)).toThrow(
      ParseErrorMessages.MissingExpectedHeaders(["Date"]),
    );
  });
});
