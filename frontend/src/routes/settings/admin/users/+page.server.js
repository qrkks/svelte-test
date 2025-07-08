import { db } from '$lib/server/db';
import { user, systemRole, organizationRole, subOrganizationRole } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { hashPassword } from '$lib/server/password';
import { eq } from 'drizzle-orm';

export async function load() {
	try {
		// 获取所有用户
		const users = await db.select().from(user).orderBy(user.createdAt);

		// 获取系统角色
		const systemRoles = await db.select().from(systemRole);

		// 获取组织角色
		const organizationRoles = await db.select().from(organizationRole);

		// 获取子组织角色
		const subOrganizationRoles = await db.select().from(subOrganizationRole);

		return {
			users,
			systemRoles,
			organizationRoles,
			subOrganizationRoles
		};
	} catch (error) {
		console.error('加载用户数据失败:', error);
		return {
			users: [],
			systemRoles: [],
			organizationRoles: [],
			subOrganizationRoles: []
		};
	}
}

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const username = formData.get('username');
			const password = formData.get('password');
			const email = formData.get('email');
			const mobile = formData.get('mobile');
			const age = formData.get('age');

			if (!username || !password) {
				return fail(400, { error: '用户名和密码不能为空' });
			}

			// 检查用户名是否已存在
			const existingUser = await db.select().from(user).where(eq(user.username, username));
			if (existingUser.length > 0) {
				return fail(400, { error: '用户名已存在' });
			}

			// 加密密码
			const passwordHash = await hashPassword(password);

			// 创建用户
			await db.insert(user).values({
				username,
				passwordHash,
				email: email || null,
				mobile: mobile || null,
				age: age ? parseInt(age) : null
			});

			return { success: true };
		} catch (error) {
			console.error('创建用户失败:', error);
			return fail(500, { error: '创建用户失败' });
		}
	},

	update: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id');
			const username = formData.get('username');
			const email = formData.get('email');
			const mobile = formData.get('mobile');
			const age = formData.get('age');

			if (!id || !username) {
				return fail(400, { error: '用户ID和用户名不能为空' });
			}

			// 检查用户名是否已被其他用户使用
			const existingUser = await db.select().from(user).where(eq(user.username, username));
			if (existingUser.length > 0 && existingUser[0].id !== parseInt(id)) {
				return fail(400, { error: '用户名已存在' });
			}

			// 更新用户
			await db.update(user)
				.set({
					username,
					email: email || null,
					mobile: mobile || null,
					age: age ? parseInt(age) : null,
					updatedAt: new Date()
				})
				.where(eq(user.id, parseInt(id)));

			return { success: true };
		} catch (error) {
			console.error('更新用户失败:', error);
			return fail(500, { error: '更新用户失败' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id');

			if (!id) {
				return fail(400, { error: '用户ID不能为空' });
			}

			// 删除用户
			await db.delete(user).where(eq(user.id, parseInt(id)));

			return { success: true };
		} catch (error) {
			console.error('删除用户失败:', error);
			return fail(500, { error: '删除用户失败' });
		}
	}
}; 