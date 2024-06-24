CREATE TABLE IF NOT EXISTS `test_builds` (
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
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `test_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `appId_idx` ON `test_builds` (`appId`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `branch_idx` ON `test_builds` (`branch`);