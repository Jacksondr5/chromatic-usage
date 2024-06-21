CREATE TABLE `test_builds` (
	`buildId` text PRIMARY KEY NOT NULL,
	`appId` text NOT NULL,
	`date` integer NOT NULL,
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
CREATE TABLE `test_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `appId_idx` ON `test_builds` (`appId`);--> statement-breakpoint
CREATE INDEX `branch_idx` ON `test_builds` (`branch`);