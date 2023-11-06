CREATE TABLE `trello-clone_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `trello-clone_post` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(256),
	`createdById` text(255) NOT NULL,
	`created_at` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `trello-clone_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trello-clone_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP(3),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `trello-clone_verificationToken` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
DROP TABLE `post`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
DROP TABLE `verificationToken`;--> statement-breakpoint
CREATE INDEX `userId_idx` ON `trello-clone_account` (`userId`);--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `trello-clone_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `trello-clone_post` (`name`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `trello-clone_session` (`userId`);