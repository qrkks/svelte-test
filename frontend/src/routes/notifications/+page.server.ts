import type { PageServerLoad, Actions } from './$types';
import { NotificationService } from '$lib/server/services/notificationService';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}

	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;

	const [notifications, unreadCount, totalCount] = await Promise.all([
		NotificationService.getUserNotifications(user.id, page, limit),
		NotificationService.getUnreadCount(user.id),
		NotificationService.getTotalCount(user.id)
	]);

	return {
		notifications,
		unreadCount,
		totalCount,
		currentPage: page,
		totalPages: Math.ceil(totalCount / limit)
	};
};

export const actions: Actions = {
	'mark-read': async ({ locals, request }) => {
		const user = locals.user;
		if (!user) {
			return { success: false, error: '未登录' };
		}

		const formData = await request.formData();
		const notificationId = formData.get('notificationId');
		const notificationIds = formData.get('notificationIds');

		if (notificationId) {
			await NotificationService.markAsRead(parseInt(notificationId.toString()), user.id);
		} else if (notificationIds) {
			const ids = notificationIds.toString().split(',').map(id => parseInt(id));
			await NotificationService.markMultipleAsRead(ids, user.id);
		}

		return { success: true };
	},

	'mark-unread': async ({ locals, request }) => {
		const user = locals.user;
		if (!user) {
			return { success: false, error: '未登录' };
		}

		const formData = await request.formData();
		const notificationIds = formData.get('notificationIds');
		if (notificationIds) {
			const ids = notificationIds.toString().split(',').map(id => parseInt(id));
			await NotificationService.markMultipleAsUnread(ids, user.id);
		}
		return { success: true };
	},

	'mark-all-read': async ({ locals }) => {
		const user = locals.user;
		if (!user) {
			return { success: false, error: '未登录' };
		}

		await NotificationService.markAllAsRead(user.id);
		return { success: true };
	}
}; 