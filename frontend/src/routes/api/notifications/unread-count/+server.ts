import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NotificationService } from '$lib/server/services/notificationService';

export const GET: RequestHandler = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return json({ count: 0 });
  }

  const count = await NotificationService.getUnreadCount(user.id);
  return json({ count });
}; 