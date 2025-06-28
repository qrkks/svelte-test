import { redirect, fail } from '@sveltejs/kit';
import { hashPassword, verifyPassword } from '$lib/server/password';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/settings/auth/login');
	}
	return { user: locals.user };
};

export const actions = {
	changePassword: async (event) => {
		if (!event.locals.user) {
			return fail(401, { message: '请先登录' });
		}

		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword');
		const newPassword = formData.get('newPassword');
		const confirmPassword = formData.get('confirmPassword');

		// 验证输入
		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: '请填写所有字段' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: '新密码确认不匹配' });
		}

		if (newPassword.length < 6) {
			return fail(400, { message: '新密码至少6位' });
		}

		// 验证当前密码
		const [user] = await db.select()
			.from(table.user)
			.where(eq(table.user.id, event.locals.user.id));
		
		const validPassword = await verifyPassword(user.passwordHash, currentPassword);

		if (!validPassword) {
			return fail(400, { message: '当前密码错误' });
		}

		// 更新密码
		const newPasswordHash = await hashPassword(newPassword);

		await db.update(table.user)
			.set({ passwordHash: newPasswordHash })
			.where(eq(table.user.id, event.locals.user.id));

		return {
			success: true,
			message: '密码修改成功'
		};
	}
};