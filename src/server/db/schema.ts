import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `test_${name}`);

export const builds = createTable(
  "builds",
  {
    id: text("buildId").primaryKey(),
    appId: text("appId").notNull(),
    date: int("date").notNull(),
    repositorySlug: text("repositorySlug").notNull(),
    branch: text("branch").notNull(),
    buildNumber: int("buildNumber").notNull(),
    skippedSnapshots: int("skippedSnapshots"),
    chromeSnapshots: int("chromeSnapshots"),
    firefoxSnapshots: int("firefoxSnapshots"),
    safariSnapshots: int("safariSnapshots"),
    edgeSnapshots: int("edgeSnapshots"),
    internetExplorerSnapshots: int("internetExplorerSnapshots"),
  },
  (table) => ({
    appIdIndex: index("appId_idx").on(table.appId),
    branchIndex: index("branch_idx").on(table.branch),
  }),
);

export const chromaticApps = createTable("apps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
