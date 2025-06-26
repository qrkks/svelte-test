import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

// GET 请求 - 页面加载时执行
export const load = async (event) => {
	const loadStartTime = new Date();

	// 🔒 路由守卫：检查用户是否登录
	//
	if (!event.locals.user) {
		throw redirect(302, '/settings/auth/login');
	}

	// 获取所有已保存的测试数据
	const testData = await db.select().from(table.test);

	const loadEndTime = new Date();
	const loadDuration = loadEndTime.getTime() - loadStartTime.getTime();

	return {
		title: '测试页面',
		testData: testData,
		loadStartTime: loadStartTime.toISOString(),
		loadEndTime: loadEndTime.toISOString(),
		loadDuration: loadDuration,
		currentTime: new Date().toISOString(),
		user: event.locals.user, // 返回用户信息
		serverInfo: {
			nodeVersion: process.version,
			environment: process.env.NODE_ENV
		}
	};
};

// POST 请求 - 表单提交时执行
export const actions = {
	// 提交数据
	submit: async (event) => {
		// 🔒 表单提交时也要检查权限
		if (!event.locals.user) {
			throw redirect(302, '/settings/auth/login');
		}

		const formData = await event.request.formData();
		const testInput = formData.get('testInput');

		// 插入数据到数据库
		// const id = crypto.randomUUID();
		await db.insert(table.test).values({
			// id: id,
			testInput: testInput
		});

		return {
			success: true,
			message: '数据保存成功',
			savedInput: testInput,
			// generatedId: id,
			timestamp: new Date().toISOString()
		};
	},

	// 删除数据
	delete: async (event) => {
		// 🔒 删除操作需要管理员权限
		if (!event.locals.user || event.locals.user.username !== 'admin') {
			return { success: false, message: '权限不足，只有管理员可以删除' };
		}

		const formData = await event.request.formData();
		const id = formData.get('id');

		await db.delete(table.test).where(eq(table.test.id, id));

		return {
			success: true,
			message: '数据删除成功',
			deletedId: id
		};
	},

	// 清空所有数据
	clear: async (event) => {
		// 🔒 清空操作需要管理员权限
		if (!event.locals.user || event.locals.user.username !== 'admin') {
			return { success: false, message: '权限不足，只有管理员可以清空' };
		}

		await db.delete(table.test);

		return {
			success: true,
			message: '所有数据已清空'
		};
	}
};
