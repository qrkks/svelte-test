// src/routes/api/notifications/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NotificationService } from '$lib/server/services/notificationService';

export const GET: RequestHandler = async ({ locals, url }) => {
  const user = locals.user;
  if (!user) {
    return json({ error: '未登录' }, { status: 401 });
  }

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const notifications = await NotificationService.getUserNotifications(user.id, page, limit);
    return json({ notifications });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return json({ error: '获取通知列表失败' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const user = locals.user;
  if (!user) {
    return json({ error: '未登录' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    if (data.type === 'individual') {
      const result = await NotificationService.sendIndividualNotification({
        userId: data.userId,
        title: data.title,
        content: data.content,
        data: data.data,
        isImportant: data.isImportant
      });

      if (!result.success) {
        return json({ error: result.error }, { status: 400 });
      }

      return json({ success: true, notification: result.data });
    } else if (data.type === 'group') {
      // 兼容两种数据格式：target（单个）和 targets（数组）
      const targets = data.targets || (data.target ? [data.target] : []);
      
      if (targets.length === 0) {
        return json({ error: '缺少目标用户配置' }, { status: 400 });
      }
      
      const result = await NotificationService.sendGroupNotification({
        title: data.title,
        content: data.content,
        targets: targets,
        data: data.data,
        isImportant: data.isImportant
      });

      if (!result.success) {
        return json({ error: result.error }, { status: 400 });
      }

      return json({ success: true, notification: result.data });
    } else {
      return json({ error: '无效的通知类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('发送通知失败:', error);
    return json({ error: '发送通知失败' }, { status: 500 });
  }
};