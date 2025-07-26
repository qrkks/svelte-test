ALTER TABLE `organization_role_permission` RENAME TO `organization_role_permission_link`;--> statement-breakpoint
ALTER TABLE `sub_organization_role_permission` RENAME TO `sub_organization_role_permission_link`;--> statement-breakpoint
ALTER TABLE `system_role_permission` RENAME TO `system_role_permission_link`;--> statement-breakpoint
ALTER TABLE `user_organization_role` RENAME TO `user_organization_role_map`;--> statement-breakpoint
ALTER TABLE `user_sub_organization_role` RENAME TO `user_sub_organization_role_map`;--> statement-breakpoint
ALTER TABLE `user_system_role` RENAME TO `user_system_role_link`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organization_role_permission_link` (
	`organization_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`organization_role_id`) REFERENCES `organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_organization_role_permission_link`("organization_role_id", "permission") SELECT "organization_role_id", "permission" FROM `organization_role_permission_link`;--> statement-breakpoint
DROP TABLE `organization_role_permission_link`;--> statement-breakpoint
ALTER TABLE `__new_organization_role_permission_link` RENAME TO `organization_role_permission_link`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_role_permission_pk` ON `organization_role_permission_link` (`organization_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `__new_sub_organization_role_permission_link` (
	`sub_organization_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`sub_organization_role_id`) REFERENCES `sub_organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sub_organization_role_permission_link`("sub_organization_role_id", "permission") SELECT "sub_organization_role_id", "permission" FROM `sub_organization_role_permission_link`;--> statement-breakpoint
DROP TABLE `sub_organization_role_permission_link`;--> statement-breakpoint
ALTER TABLE `__new_sub_organization_role_permission_link` RENAME TO `sub_organization_role_permission_link`;--> statement-breakpoint
CREATE UNIQUE INDEX `sub_organization_role_permission_pk` ON `sub_organization_role_permission_link` (`sub_organization_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `__new_system_role_permission_link` (
	`system_role_id` integer NOT NULL,
	`permission` text NOT NULL,
	FOREIGN KEY (`system_role_id`) REFERENCES `system_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_system_role_permission_link`("system_role_id", "permission") SELECT "system_role_id", "permission" FROM `system_role_permission_link`;--> statement-breakpoint
DROP TABLE `system_role_permission_link`;--> statement-breakpoint
ALTER TABLE `__new_system_role_permission_link` RENAME TO `system_role_permission_link`;--> statement-breakpoint
CREATE UNIQUE INDEX `system_role_permission_pk` ON `system_role_permission_link` (`system_role_id`,`permission`);--> statement-breakpoint
CREATE TABLE `__new_user_organization_role_map` (
	`user_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`organization_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_role_id`) REFERENCES `organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_organization_role_map`("user_id", "organization_id", "organization_role_id") SELECT "user_id", "organization_id", "organization_role_id" FROM `user_organization_role_map`;--> statement-breakpoint
DROP TABLE `user_organization_role_map`;--> statement-breakpoint
ALTER TABLE `__new_user_organization_role_map` RENAME TO `user_organization_role_map`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_organization_role_pk` ON `user_organization_role_map` (`user_id`,`organization_id`,`organization_role_id`);--> statement-breakpoint
CREATE TABLE `__new_user_sub_organization_role_map` (
	`user_id` integer NOT NULL,
	`sub_organization_id` integer NOT NULL,
	`sub_organization_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_organization_id`) REFERENCES `sub_organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_organization_role_id`) REFERENCES `sub_organization_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_sub_organization_role_map`("user_id", "sub_organization_id", "sub_organization_role_id") SELECT "user_id", "sub_organization_id", "sub_organization_role_id" FROM `user_sub_organization_role_map`;--> statement-breakpoint
DROP TABLE `user_sub_organization_role_map`;--> statement-breakpoint
ALTER TABLE `__new_user_sub_organization_role_map` RENAME TO `user_sub_organization_role_map`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_sub_organization_role_pk` ON `user_sub_organization_role_map` (`user_id`,`sub_organization_id`,`sub_organization_role_id`);--> statement-breakpoint
CREATE TABLE `__new_user_system_role_link` (
	`user_id` integer NOT NULL,
	`system_role_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`system_role_id`) REFERENCES `system_role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_system_role_link`("user_id", "system_role_id") SELECT "user_id", "system_role_id" FROM `user_system_role_link`;--> statement-breakpoint
DROP TABLE `user_system_role_link`;--> statement-breakpoint
ALTER TABLE `__new_user_system_role_link` RENAME TO `user_system_role_link`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_system_role_pk` ON `user_system_role_link` (`user_id`,`system_role_id`);