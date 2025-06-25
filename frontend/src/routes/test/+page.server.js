import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

// GET 请求 - 页面加载时执行
export const load = async (event) => {
	console.log(event);
	const loadStartTime = new Date();
	console.log('load 函数开始执行...', loadStartTime.toISOString());
	
	// 🔒 路由守卫：检查用户是否登录
	console.log('检查用户登录状态:', event.locals.user);
	if (!event.locals.user) {
		console.log('用户未登录，重定向到登录页');
		throw redirect(302, '/settings/lucia/login');
	}
	
	// 🔒 路由守卫：检查用户权限（模拟）
	console.log('检查用户权限:', event.locals.user.username);
	if (event.locals.user.username === 'admin') {
		console.log('管理员用户，允许访问');
	} else {
		console.log('普通用户，允许访问');
	}
	
	// 模拟异步操作（延迟 2 秒）
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	console.log('load 函数执行完成，开始获取数据...');
	
	// 获取所有已保存的测试数据
	const testData = await db.select().from(table.test);
	
	const loadEndTime = new Date();
	const loadDuration = loadEndTime.getTime() - loadStartTime.getTime();
	
	console.log('数据获取完成，返回结果...');
	console.log(`load 函数总耗时: ${loadDuration}ms`);
	
	return {
		title: "测试页面",
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
			throw redirect(302, '/settings/lucia/login');
		}
		
		console.log(event);
		const formData = await event.request.formData();
		const testInput = formData.get('testInput');
		
		// 插入数据到数据库
		const id = crypto.randomUUID();
		await db.insert(table.test).values({
			id: id,
			testInput: testInput
		});
		
		return { 
			success: true, 
			message: "数据保存成功",
			savedInput: testInput,
			generatedId: id,
			timestamp: new Date().toISOString()
		};
	},
	
	// 删除数据
	delete: async (event) => {
		// 🔒 删除操作需要管理员权限
		if (!event.locals.user || event.locals.user.username !== 'admin') {
			return { success: false, message: "权限不足，只有管理员可以删除" };
		}
		
		console.log(event);
		const formData = await event.request.formData();
		const id = formData.get('id');
		
		await db.delete(table.test).where(eq(table.test.id, id));
		
		return {
			success: true,
			message: "数据删除成功",
			deletedId: id
		};
	},
	
	// 清空所有数据
	clear: async (event) => {
		// 🔒 清空操作需要管理员权限
		if (!event.locals.user || event.locals.user.username !== 'admin') {
			return { success: false, message: "权限不足，只有管理员可以清空" };
		}
		
		await db.delete(table.test);
		
		return {
			success: true,
			message: "所有数据已清空"
		};
	}
};
