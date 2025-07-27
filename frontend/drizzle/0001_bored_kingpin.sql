ALTER TABLE `user_notification` RENAME TO `user_notification_link`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_notification_link` (
	`user_id` integer NOT NULL,
	`notification_id` integer NOT NULL,
	`is_read` integer DEFAULT false,
	`read_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`notification_id`) REFERENCES `notification`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_notification_link`("user_id", "notification_id", "is_read", "read_at", "created_at") SELECT "user_id", "notification_id", "is_read", "read_at", "created_at" FROM `user_notification_link`;--> statement-breakpoint
DROP TABLE `user_notification_link`;--> statement-breakpoint
ALTER TABLE `__new_user_notification_link` RENAME TO `user_notification_link`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_notification_pk` ON `user_notification_link` (`user_id`,`notification_id`);