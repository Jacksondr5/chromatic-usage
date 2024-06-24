import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `test_${name}`);

export const chromaticApps = createTable("apps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const builds = createTable(
  "builds",
  {
    buildId: text("buildId").primaryKey(),
    appId: text("appId")
      .notNull()
      .references(() => chromaticApps.id),
    date: text("date").notNull(),
    repositorySlug: text("repositorySlug").notNull(),
    branch: text("branch").notNull(),
    buildNumber: int("buildNumber").notNull(),
    skippedSnapshots: int("skippedSnapshots").notNull(),
    chromeSnapshots: int("chromeSnapshots").notNull(),
    firefoxSnapshots: int("firefoxSnapshots").notNull(),
    safariSnapshots: int("safariSnapshots").notNull(),
    edgeSnapshots: int("edgeSnapshots").notNull(),
    internetExplorerSnapshots: int("internetExplorerSnapshots").notNull(),
    totalSnapshots: int("totalSnapshots").notNull(),
  },
  (table) => ({
    appIdIndex: index("appId_idx").on(table.appId),
    branchIndex: index("branch_idx").on(table.branch),
  }),
);
