/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

ALTER TABLE test_builds RENAME TO _test_builds_old;

CREATE TABLE `test_builds` (
	`buildId` text PRIMARY KEY NOT NULL,
	`appId` text NOT NULL,
	`date` text NOT NULL,
	`repositorySlug` text NOT NULL,
	`branch` text NOT NULL,
	`buildNumber` integer NOT NULL,
	`skippedSnapshots` integer,
	`chromeSnapshots` integer,
	`firefoxSnapshots` integer,
	`safariSnapshots` integer,
	`edgeSnapshots` integer,
	`internetExplorerSnapshots` integer
  CONSTRAINT fk_appId 
    FOREIGN KEY (appId) 
    REFERENCES test_apps(id)
);

INSERT INTO test_builds SELECT * FROM _test_builds_old;

DROP TABLE _test_builds_old;

COMMIT;

PRAGMA foreign_keys=on;