import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hashPassword, validatePassword, validateUsername } from '$lib/server/password';
import * as auth from '$lib/server/auth';

export const actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: '用户名格式不正确' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: '密码格式不正确' });
		}

		const passwordHash = await hashPassword(password);

		try {
			const [{ id: userID }] = await db
				.insert(table.user)
				.values({ username, passwordHash, password })
				.returning({ id: table.user.id });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userID);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Registration error details:', {
				errorType: error.constructor.name,
				code: error.code,
				message: error.message
			});

			if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' && error.message.includes('user.username')) {
				return fail(400, {
					code: 'USERNAME_EXISTS',
					message: '用户名已存在'
				});
			}

			return fail(500, {
				code: 'UNKNOWN_ERROR',
				message: '注册失败，请稍后重试',
				debug: `${error.code}: ${error.message}`
			});
			// CHECK: 上线时检查错误捕获，正式环境使用postgres, 这些捕获能否覆盖；上线后，重新测试。
		}
		throw redirect(302, '/settings/auth/login');
	}
};
