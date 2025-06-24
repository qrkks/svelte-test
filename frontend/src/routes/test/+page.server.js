import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const actions = {
	submit: async (event) => {
		const formData = await event.request.formData();
		const testInput = formData.get('testInput');

		// 验证输入
		if (!testInput || typeof testInput !== 'string' || testInput.trim() === '') {
			return fail(400, { 
				message: '请输入有效的内容',
				testInput: testInput || ''
			});
		}

		try {
			// 生成唯一ID
			const id = crypto.randomUUID();
			
			// 插入数据到数据库
			await db.insert(table.test).values({
				id: id,
				testInput: testInput.trim()
			});

			// 返回成功消息
			return { 
				success: true, 
				message: '数据提交成功！',
				testInput: ''
			};
		} catch (error) {
			console.error('数据库插入错误:', error);
			return fail(500, { 
				message: '提交失败，请重试',
				testInput: testInput
			});
		}
	}
};
