/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/
PRAGMA foreign_keys = off;

BEGIN TRANSACTION;

-- This data is ephemeral, so we can drop it
DROP TABLE IF EXISTS test_builds;

CREATE TABLE
  `test_builds` (
    `buildId` text PRIMARY KEY NOT NULL,
    `appId` text NOT NULL,
    `date` text NOT NULL,
    `repositorySlug` text NOT NULL,
    `branch` text NOT NULL,
    `buildNumber` integer NOT NULL,
    `skippedSnapshots` integer NOT NULL,
    `chromeSnapshots` integer NOT NULL,
    `firefoxSnapshots` integer NOT NULL,
    `safariSnapshots` integer NOT NULL,
    `edgeSnapshots` integer NOT NULL,
    `internetExplorerSnapshots` integer NOT NULL,
    `totalSnapshots` integer NOT NULL,
    CONSTRAINT fk_appId FOREIGN KEY (appId) REFERENCES test_apps (id)
  );

COMMIT;

PRAGMA foreign_keys = ON;