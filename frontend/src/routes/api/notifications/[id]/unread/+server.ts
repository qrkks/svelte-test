import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NotificationService } from '$lib/server/services/notificationService';

export const POST: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: '未登录' }, { status: 401 });
	}

	const notificationId = parseInt(params.id);
	await NotificationService.markAsUnread(notificationId, user.id);

	return json({ success: true });
};