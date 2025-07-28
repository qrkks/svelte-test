import type { PageServerLoad, Actions } from './$types';
import { NotificationService } from '$lib/server/services/notificationService';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}

	// 这里可以添加权限检查，确保只有管理员可以发送通知
	// 暂时跳过权限检查，后续可以添加

	return {};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, { error: '未登录' });
		}

		const formData = await request.formData();
		const title = formData.get('title')?.toString();
		const content = formData.get('content')?.toString();
		const targetType = formData.get('targetType')?.toString();
		const targetId = formData.get('targetId')?.toString();
		const isImportant = formData.has('isImportant');

		if (!title || !content || !targetType) {
			return fail(400, { error: '请填写所有必填字段' });
		}

		try {
			const target = {
				type: targetType as any,
				id: targetId ? parseInt(targetId) : undefined
			};

			await NotificationService.sendGroupNotification({
				title,
				content,
				targets: [target], // 将单个target包装成数组
				isImportant
			});

			return { success: true };
		} catch (error) {
			console.error('发送通知失败:', error);
			return fail(500, { error: '发送通知失败，请重试' });
		}
	}
}; 