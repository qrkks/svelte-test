import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

// TODO: 中间表加标记
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
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
	lastLoginAt: integer('last_login_at', { mode: 'timestamp' })
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
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// 主组织角色表
export const organizationRole = sqliteTable('organization_role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 会长、CEO、总裁等
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// 用户-主组织-角色关联表
export const userOrganizationRole = sqliteTable(
	'user_organization_role',
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
export const organizationRolePermission = sqliteTable(
	'organization_role_permission',
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
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// 子组织角色表
export const subOrganizationRole = sqliteTable('sub_organization_role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 主席、经理、总监等
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// 用户-子组织-角色关联表
export const userSubOrganizationRole = sqliteTable(
	'user_sub_organization_role',
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
export const subOrganizationRolePermission = sqliteTable(
	'sub_organization_role_permission',
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
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// 用户-系统角色关联表
export const userSystemRole = sqliteTable(
	'user_system_role',
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
export const systemRolePermission = sqliteTable(
	'system_role_permission',
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
