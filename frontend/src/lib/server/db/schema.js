import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

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

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const role = sqliteTable('role', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	description: text('description')
});

export const userRole = sqliteTable('user_role', {
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	roleId: integer('role_id')
		.notNull()
		.references(() => role.id)
}, (table) => ({
	pk: unique('user_role_pk').on(table.userId, table.roleId)
}));

export const rolePermission = sqliteTable('role_permission', {
	roleId: integer('role_id')
		.notNull()
		.references(() => role.id),
	permission: text('permission').notNull()
}, (table) => ({
	pk: unique('role_permission_pk').on(table.roleId, table.permission)
}));

export const test = sqliteTable('test', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	testInput: text('test_input').notNull()
});
