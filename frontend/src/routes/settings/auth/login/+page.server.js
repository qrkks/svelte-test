// import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import {
	hashPassword,
	verifyPassword,
	validatePassword,
	validateUsername
} from '$lib/server/password';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/settings/auth');
	}
	return {};
};

export const actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/settings/auth');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const passwordHash = await hashPassword(password);

		try {
			const [{ id: userID }] = await db
				.insert(table.user)
				.values({ username, passwordHash, password })
				.returning({ id: table.user.id });
			// 生成sessionToken，generateSessionToken()函数生成一个18字节的随机字符串，并返回一个base64url编码的字符串
			const sessionToken = auth.generateSessionToken();
			// 生成sessionID，将sessionID，userId，expiresAt写入数据库并返回session对象
			const session = await auth.createSession(sessionToken, userID);
			// 设置sessionToken到cookie中
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			// 添加调试日志
			console.error('Registration error details:', {
				errorType: error.constructor.name,
				code: error.code,
				message: error.message
			});

			// 直接处理唯一性约束错误
			if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' && error.message.includes('user.username')) {
				console.log('捕获到用户名重复错误，返回友好提示');
				return fail(400, {
					code: 'USERNAME_EXISTS',
					message: '用户名已存在'
				});
			}

			// 其他错误返回通用错误信息
			console.log('未捕获到具体错误类型，返回通用错误');
			return fail(500, {
				code: 'UNKNOWN_ERROR',
				message: '注册失败，请稍后重试',
				debug: `${error.code}: ${error.message}`  // 在开发环境保留错误信息
			});
		}
		return redirect(302, '/settings/auth');
	}
};

// function generateUserId() {
// 	const bytes = crypto.getRandomValues(new Uint8Array(15));
// 	const id = encodeBase32LowerCase(bytes);
// 	return id;
// }
