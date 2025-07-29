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
		const isImportant = formData.has('isImportant');

		if (!title || !content) {
			return fail(400, { error: '请填写所有必填字段' });
		}

		try {
			// 解析多个targets
			const targets: Array<{ type: 'all_users' | 'organization' | 'role' | 'sub_organization' | 'custom'; id?: number }> = [];
			const targetEntries = Array.from(formData.entries()).filter(([key]) => 
				key.startsWith('targets[') && key.includes('[type]')
			);

			for (const [key, value] of targetEntries) {
				const match = key.match(/targets\[(\d+)\]\[type\]/);
				if (match) {
					const index = parseInt(match[1]);
					const type = value.toString() as 'all_users' | 'organization' | 'role' | 'sub_organization' | 'custom';
					
					// 查找对应的id
					const idKey = `targets[${index}][id]`;
					const idValue = formData.get(idKey)?.toString();
					
					targets.push({
						type,
						id: idValue ? parseInt(idValue) : undefined
					});
				}
			}

			if (targets.length === 0) {
				return fail(400, { error: '请至少选择一个目标' });
			}

			await NotificationService.sendGroupNotification({
				title,
				content,
				targets,
				isImportant
			});

			return { success: true };
		} catch (error) {
			console.error('发送通知失败:', error);
			return fail(500, { error: '发送通知失败，请重试' });
		}
	}
}; 