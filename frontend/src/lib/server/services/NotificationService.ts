// src/lib/server/services/NotificationService.ts
import { db } from '$lib/server/db';
import {
	notification,
	groupNotificationConfig,
	userNotification,
	user,
	userOrganizationRoleMap,
	userSystemRoleLink
} from '$lib/server/db/schema';
import { eq, and, or, isNull, inArray, desc, sql } from 'drizzle-orm';

// 临时类型定义，后续可以移到单独的类型文件
export type NotificationTarget = {
	type: 'all_users' | 'organization' | 'role' | 'sub_organization' | 'custom';
	id?: number;
	conditions?: any;
};

export class NotificationService {
	// 发送个人通知
	static async sendIndividualNotification(data: {
		userId: number;
		title: string;
		content: string;
		data?: any;
		isImportant?: boolean;
	}) {
		const [newNotification] = await db
			.insert(notification)
			.values({
				type: 'individual',
				title: data.title,
				content: data.content,
				data: data.data ? JSON.stringify(data.data) : null,
				isImportant: data.isImportant || false
			})
			.returning();

		await db.insert(userNotification).values({
			userId: data.userId,
			notificationId: newNotification.id
		});

		return newNotification;
	}

	// 发送群体通知
	static async sendGroupNotification(data: {
		title: string;
		content: string;
		target: NotificationTarget;
		data?: any;
		isImportant?: boolean;
	}) {
		// 1. 创建通知内容
		const [newNotification] = await db
			.insert(notification)
			.values({
				type: 'group',
				title: data.title,
				content: data.content,
				data: data.data ? JSON.stringify(data.data) : null,
				isImportant: data.isImportant || false
			})
			.returning();

		// 2. 存储群体选择信息
		await db.insert(groupNotificationConfig).values({
			notificationId: newNotification.id,
			targetType: data.target.type,
			targetId: 'id' in data.target ? data.target.id : null,
			targetConditions: 'conditions' in data.target ? JSON.stringify(data.target.conditions) : null
		});

		// 3. 获取目标用户列表
		const targetUsers = await this.getTargetUsers(data.target);

		// 4. 为每个目标用户创建通知状态记录
		if (targetUsers.length > 0) {
			const userNotifications = targetUsers.map((userId) => ({
				userId: userId,
				notificationId: newNotification.id
			}));

			await db.insert(userNotification).values(userNotifications);
		}

		return newNotification;
	}

	// 获取目标用户列表
	private static async getTargetUsers(target: NotificationTarget): Promise<number[]> {
		switch (target.type) {
			case 'all_users':
				const allUsers = await db.select({ id: user.id }).from(user);
				return allUsers.map((u) => u.id);

			case 'organization':
				const orgUsers = await db
					.select({ id: user.id })
					.from(user)
					.innerJoin(userOrganizationRoleMap, eq(user.id, userOrganizationRoleMap.userId))
					.where(eq(userOrganizationRoleMap.organizationId, target.id!));
				return orgUsers.map((u) => u.id);

			case 'role':
				// FIXME: 这里只支持系统角色，不支持组织角色，是否需要支持组织角色？
				const roleUsers = await db
					.select({ id: user.id })
					.from(user)
					.innerJoin(userSystemRoleLink, eq(user.id, userSystemRoleLink.userId))
					.where(eq(userSystemRoleLink.systemRoleId, target.id!));
				return roleUsers.map((u) => u.id);

			case 'custom':
				return await this.getUsersByConditions(target.conditions);

			default:
				return [];
		}
	}

	// 根据条件获取用户
	private static async getUsersByConditions(conditions: any): Promise<number[]> {
		// 实现复杂的用户筛选逻辑
		// 这里可以根据年龄、部门、角色等条件筛选
		return [];
	}

	// 获取用户通知列表
	static async getUserNotifications(userId: number, page = 1, limit = 20) {
		const offset = (page - 1) * limit;

		const notifications = await db
			.select({
				id: notification.id,
				type: notification.type,
				title: notification.title,
				content: notification.content,
				data: notification.data,
				is_important: notification.isImportant,
				created_at: notification.createdAt,
				is_read: userNotification.isRead,
				read_at: userNotification.readAt
			})
			.from(notification)
			.innerJoin(userNotification, eq(notification.id, userNotification.notificationId))
			.where(eq(userNotification.userId, userId))
			.orderBy(desc(notification.createdAt))
			.limit(limit)
			.offset(offset);

		return notifications.map((n) => ({
			...n,
			data: n.data ? JSON.parse(n.data) : null
		}));
	}

	// 获取用户未读通知数量
	static async getUnreadCount(userId: number): Promise<number> {
		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(userNotification)
			.where(and(eq(userNotification.userId, userId), eq(userNotification.isRead, false)));

		return count;
	}

	// 获取用户通知总数
	static async getTotalCount(userId: number): Promise<number> {
		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(userNotification)
			.where(eq(userNotification.userId, userId));

		return count;
	}

	// 标记通知为已读
	static async markAsRead(notificationId: number, userId: number) {
		await db
			.update(userNotification)
			.set({
				isRead: true,
				readAt: new Date()
			})
			.where(
				and(
					eq(userNotification.notificationId, notificationId),
					eq(userNotification.userId, userId)
				)
			);
	}

	// 批量标记为已读
	static async markMultipleAsRead(notificationIds: number[], userId: number) {
		await db
			.update(userNotification)
			.set({
				isRead: true,
				readAt: new Date()
			})
			.where(
				and(
					inArray(userNotification.notificationId, notificationIds),
					eq(userNotification.userId, userId)
				)
			);
	}

	// 标记所有为已读
	static async markAllAsRead(userId: number) {
		await db
			.update(userNotification)
			.set({
				isRead: true,
				readAt: new Date()
			})
			.where(eq(userNotification.userId, userId));
	}
}
