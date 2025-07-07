CREATE TABLE `organization` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_name_unique` ON `organization` (`name`);--> statement-breakpoint
CREATE TABLE `organization_role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_role_name_unique` ON `organization_role` (`name`);--> statement-breakpoint
CREATE TABLE `organization_role_permission` (
	`organization_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`organization_role_id`) REFERENCES `organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_role_permission_pk` ON `organization_role_permission` (`organization_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_name_unique` ON `role` (`name`);--> statement-breakpoint
CREATE TABLE `role_permission` (
	`role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `role_permission_pk` ON `role_permission` (`role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sub_organization` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`organization_id` integer NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sub_organization_name_unique` ON `sub_organization` (`name`);--> statement-breakpoint
CREATE TABLE `sub_organization_role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sub_organization_role_name_unique` ON `sub_organization_role` (`name`);--> statement-breakpoint
CREATE TABLE `sub_organization_role_permission` (
	`sub_organization_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`sub_organization_role_id`) REFERENCES `sub_organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sub_organization_role_permission_pk` ON `sub_organization_role_permission` (`sub_organization_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `system_role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `system_role_name_unique` ON `system_role` (`name`);--> statement-breakpoint
CREATE TABLE `system_role_permission` (
	`system_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`system_role_id`) REFERENCES `system_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `system_role_permission_pk` ON `system_role_permission` (`system_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`test_input` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text,
	`password_hash` text NOT NULL,
	`mobile` text,
	`email` text,
	`age` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_mobile_unique` ON `user` (`mobile`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `user_organization_role` (
	`user_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`organization_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_role_id`) REFERENCES `organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_organization_role_pk` ON `user_organization_role` (`user_id`,`organization_id`,`organization_role_id`);--> statement-breakpoint
CREATE TABLE `user_role` (
	`user_id` integer NOT NULL,
	`role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_role_pk` ON `user_role` (`user_id`,`role_id`);--> statement-breakpoint
CREATE TABLE `user_sub_organization_role` (
	`user_id` integer NOT NULL,
	`sub_organization_id` integer NOT NULL,
	`sub_organization_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_organization_id`) REFERENCES `sub_organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_organization_role_id`) REFERENCES `sub_organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_sub_organization_role_pk` ON `user_sub_organization_role` (`user_id`,`sub_organization_id`,`sub_organization_role_id`);--> statement-breakpoint
CREATE TABLE `user_system_role` (
	`user_id` integer NOT NULL,
	`system_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`system_role_id`) REFERENCES `system_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_system_role_pk` ON `user_system_role` (`user_id`,`system_role_id`);