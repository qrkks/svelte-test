import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

// TODO: 加JSDoc

// 用户表
export const user = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	password: text('password'),
	// DEBUG: 生产环境password字段需要移除
	passwordHash: text('password_hash').notNull(),
	mobile: text('mobile').unique(),
	email: text('email').unique(),
	age: integer('age'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	lastLoginAt: text('last_login_at').default(sql`CURRENT_TIMESTAMP`)
});

// 会话表
export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// 主组织表（可以是协会、公司、集团等）
export const organization = sqliteTable('organization', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	type: text('type').notNull(), // association/company/group
	description: text('description'),
	status: text('status').notNull().default('active'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 主组织角色表
export const organizationRole = sqliteTable('organization_role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 会长、CEO、总裁等
	description: text('description'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

/**
 * 权限系统表
 */

// 用户-主组织-角色关联表
export const userOrganizationRoleMap = sqliteTable(
	'user_organization_role_map',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => user.id),
		organizationId: integer('organization_id')
			.notNull()
			.references(() => organization.id),
		organizationRoleId: integer('organization_role_id')
			.notNull()
			.references(() => organizationRole.id)
	},
	(table) => ({
		pk: unique('user_organization_role_pk').on(
			table.userId,
			table.organizationId,
			table.organizationRoleId
		)
	})
);

// 主组织角色-权限关联表
export const organizationRolePermissionLink = sqliteTable(
	'organization_role_permission_link',
	{
		organizationRoleId: integer('organization_role_id')
			.notNull()
			.references(() => organizationRole.id),
		permission: text('permission').notNull() // 如：organization:manage, sub_organization:create
	},
	(table) => ({
		pk: unique('organization_role_permission_pk').on(table.organizationRoleId, table.permission)
	})
);

// 子组织表（关联到主组织）
export const subOrganization = sqliteTable('sub_organization', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organization.id), // 所属主组织
	type: text('type').notNull(), // committee/department/subsidiary
	description: text('description'),
	status: text('status').notNull().default('active'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 子组织角色表
export const subOrganizationRole = sqliteTable('sub_organization_role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 主席、经理、总监等
	description: text('description'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 用户-子组织-角色关联表
export const userSubOrganizationRoleMap = sqliteTable(
	'user_sub_organization_role_map',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => user.id),
		subOrganizationId: integer('sub_organization_id')
			.notNull()
			.references(() => subOrganization.id),
		subOrganizationRoleId: integer('sub_organization_role_id')
			.notNull()
			.references(() => subOrganizationRole.id)
	},
	(table) => ({
		pk: unique('user_sub_organization_role_pk').on(
			table.userId,
			table.subOrganizationId,
			table.subOrganizationRoleId
		)
	})
);

// 子组织角色-权限关联表
export const subOrganizationRolePermissionLink = sqliteTable(
	'sub_organization_role_permission_link',
	{
		subOrganizationRoleId: integer('sub_organization_role_id')
			.notNull()
			.references(() => subOrganizationRole.id),
		permission: text('permission').notNull() // 如：sub_organization:approve, sub_organization:view
	},
	(table) => ({
		pk: unique('sub_organization_role_permission_pk').on(
			table.subOrganizationRoleId,
			table.permission
		)
	})
);

// 系统角色表
export const systemRole = sqliteTable('system_role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // admin/super_admin
	description: text('description'),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 用户-系统角色关联表
export const userSystemRoleLink = sqliteTable(
	'user_system_role_link',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => user.id),
		systemRoleId: integer('system_role_id')
			.notNull()
			.references(() => systemRole.id)
	},
	(table) => ({
		pk: unique('user_system_role_pk').on(table.userId, table.systemRoleId)
	})
);

// 系统角色-权限关联表
export const systemRolePermissionLink = sqliteTable(
	'system_role_permission_link',
	{
		systemRoleId: integer('system_role_id')
			.notNull()
			.references(() => systemRole.id),
		permission: text('permission').notNull() // 如：system:admin, system:config
	},
	(table) => ({
		pk: unique('system_role_permission_pk').on(table.systemRoleId, table.permission)
	})
);

// 保留原有的测试表
export const test = sqliteTable('test', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	testInput: text('test_input').notNull()
});

/**
 * 通知系统
 */

// 通知内容表
export const notification = sqliteTable('notification', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type').notNull(), // 'individual' | 'group'
	title: text('title').notNull(),
	content: text('content').notNull(),
	data: text('data'), // JSON string
	isImportant: integer('is_important', { mode: 'boolean' }).default(false),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 群体通知配置表
export const groupNotificationConfig = sqliteTable('group_notification_config', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	notificationId: integer('notification_id')
		.notNull()
		.references(() => notification.id),
	targetType: text('target_type').notNull(),
	targetId: integer('target_id'),
	targetConditions: text('target_conditions'), // JSON string
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

// 用户通知状态表
export const userNotificationLink = sqliteTable(
	'user_notification_link',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => user.id),
		notificationId: integer('notification_id')
			.notNull()
			.references(() => notification.id),
		isRead: integer('is_read', { mode: 'boolean' }).default(false),
		readAt: integer('read_at', { mode: 'timestamp' }),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		pk: unique('user_notification_pk').on(table.userId, table.notificationId)
	})
);
