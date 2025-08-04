// src/lib/server/services/notificationService.ts
import { db } from '$lib/server/db';
import {
	notification,
	groupNotificationConfig,
	userNotificationLink,
	user,
	userOrganizationRoleMap,
	userSystemRoleLink
} from '$lib/server/db/schema';
import { eq, and, or, isNull, inArray, desc, sql } from 'drizzle-orm';
import type { 
	NotificationTarget, 
	Notification, 
	SendIndividualNotificationData, 
	SendGroupNotificationData
} from '$lib/types/notification';
import { NotificationResult } from '$lib/types/notification';

/**
 * 通知服务类 - 提供完整的通知管理功能
 * 
 * 可用方法列表：
 * 
 * 发送通知：
 * - sendIndividualNotification() - 发送个人通知
 * - sendGroupNotification() - 发送群体通知（支持多个目标群体）
 * 
 * 获取通知：
 * - getUserNotifications() - 获取用户通知列表（支持分页）
 * - getUnreadCount() - 获取用户未读通知数量
 * - getTotalCount() - 获取用户通知总数
 * 
 * 标记通知状态：
 * - markAsRead() - 标记单个通知为已读
 * - markAsUnread() - 标记单个通知为未读
 * - markMultipleAsRead() - 批量标记通知为已读
 * - markMultipleAsUnread() - 批量标记通知为未读
 * - markAllAsRead() - 标记所有通知为已读
 * 
 * 私有方法：
 * - getTargetUsers() - 获取目标用户列表
 * - getUsersByConditions() - 根据条件获取用户
 * - validateTarget() - 验证目标配置
 */

export class NotificationService {
	// 发送个人通知
	static async sendIndividualNotification(data: SendIndividualNotificationData): Promise<NotificationResult<Notification>> {
		try {
			// 参数验证
			if (!data.userId || !data.title || !data.content) {
				return NotificationResult.error('缺少必要参数');
			}

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

			await db.insert(userNotificationLink).values({
				userId: data.userId,
				notificationId: newNotification.id
			});

			return NotificationResult.success(newNotification as Notification);
		} catch (error) {
			console.error('发送个人通知失败:', error);
			return NotificationResult.error('发送个人通知失败');
		}
	}

	// 发送群体通知（支持多个目标群体）
	static async sendGroupNotification(data: SendGroupNotificationData): Promise<NotificationResult<Notification>> {
		try {
			// 参数验证
			if (!data.title || !data.content) {
				return NotificationResult.error('缺少必要参数');
			}

			if (!data.targets || data.targets.length === 0) {
				return NotificationResult.error('至少需要一个目标');
			}

			// 验证所有目标
			for (const target of data.targets) {
				const validationResult = this.validateTarget(target);
				if (!validationResult.success) {
					return validationResult;
				}
			}

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

			// 2. 存储多个群体选择信息
			const configs = data.targets.map((target: NotificationTarget) => ({
				notificationId: newNotification.id,
				targetType: target.type,
				targetId: target.id ?? null,
				targetConditions: target.conditions ? JSON.stringify(target.conditions) : null
			}));

			await db.insert(groupNotificationConfig).values(configs);

			// 3. 获取所有目标用户列表（去重）
			const allTargetUsers = await this.getTargetUsersBatch(data.targets);

			// 4. 为每个目标用户创建通知状态记录
			if (allTargetUsers.length > 0) {
				const userNotifications = allTargetUsers.map((userId) => ({
					userId: userId,
					notificationId: newNotification.id
				}));

				await db.insert(userNotificationLink).values(userNotifications);
			}

			return NotificationResult.success(newNotification as Notification);
		} catch (error) {
			console.error('发送群体通知失败:', error);
			return NotificationResult.error('发送群体通知失败');
		}
	}

	// 验证目标配置
	private static validateTarget(target: NotificationTarget): NotificationResult<Notification> {
		if (!target.type) {
			return NotificationResult.error('目标类型不能为空');
		}

		// 检查是否需要ID
		if (target.type === 'organization' || target.type === 'role' || target.type === 'sub_organization') {
			if (!target.id) {
				return NotificationResult.error(`${target.type}类型需要指定ID`);
			}
		}

		return NotificationResult.success({} as Notification);
	}

	// 批量获取目标用户（性能优化）
	private static async getTargetUsersBatch(targets: NotificationTarget[]): Promise<number[]> {
		const allUserIds = new Set<number>();
		
		// 按类型分组，减少查询次数
		const groupedTargets = this.groupTargetsByType(targets);
		
		for (const [type, typeTargets] of groupedTargets) {
			const userIds = await this.getUsersByType(type, typeTargets);
			userIds.forEach(id => allUserIds.add(id));
		}
		
		return Array.from(allUserIds);
	}

	// 按类型分组目标
	private static groupTargetsByType(targets: NotificationTarget[]): Map<string, NotificationTarget[]> {
		const grouped = new Map<string, NotificationTarget[]>();
		
		for (const target of targets) {
			if (!grouped.has(target.type)) {
				grouped.set(target.type, []);
			}
			grouped.get(target.type)!.push(target);
		}
		
		return grouped;
	}

	// 根据类型批量获取用户
	private static async getUsersByType(type: string, targets: NotificationTarget[]): Promise<number[]> {
		switch (type) {
			case 'all_users':
				const allUsers = await db.select({ id: user.id }).from(user);
				return allUsers.map((u) => u.id);

			case 'organization':
				const orgIds = targets.map(t => t.id!).filter(Boolean);
				if (orgIds.length === 0) return [];
				
				const orgUsers = await db
					.select({ id: user.id })
					.from(user)
					.innerJoin(userOrganizationRoleMap, eq(user.id, userOrganizationRoleMap.userId))
					.where(inArray(userOrganizationRoleMap.organizationId, orgIds));
				return orgUsers.map((u) => u.id);

			case 'role':
				const roleIds = targets.map(t => t.id!).filter(Boolean);
				if (roleIds.length === 0) return [];
				
				const roleUsers = await db
					.select({ id: user.id })
					.from(user)
					.innerJoin(userSystemRoleLink, eq(user.id, userSystemRoleLink.userId))
					.where(inArray(userSystemRoleLink.systemRoleId, roleIds));
				return roleUsers.map((u) => u.id);

			case 'custom':
				const customUserIds: number[] = [];
				for (const target of targets) {
					const userIds = await this.getUsersByConditions(target.conditions);
					customUserIds.push(...userIds);
				}
				return customUserIds;

			default:
				return [];
		}
	}

	// 获取目标用户列表（单个目标）
	private static async getTargetUsers(target: NotificationTarget): Promise<number[]> {
		const validationResult = this.validateTarget(target);
		if (!validationResult.success) {
			return [];
		}

		return this.getUsersByType(target.type, [target]);
	}

	// 根据条件获取用户
	private static async getUsersByConditions(conditions: any): Promise<number[]> {
		// 实现复杂的用户筛选逻辑
		// 这里可以根据年龄、部门、角色等条件筛选
		// 暂时返回空数组，后续可以扩展
		return [];
	}

	// 获取用户通知列表
	static async getUserNotifications(userId: number, page = 1, limit = 20): Promise<Notification[]> {
		try {
			const offset = (page - 1) * limit;

			const notifications = await db
				.select({
					id: notification.id,
					type: notification.type,
					title: notification.title,
					content: notification.content,
					data: notification.data,
					isImportant: notification.isImportant,
					createdAt: notification.createdAt,
					isRead: userNotificationLink.isRead,
					readAt: userNotificationLink.readAt
				})
				.from(notification)
				.innerJoin(userNotificationLink, eq(notification.id, userNotificationLink.notificationId))
				.where(eq(userNotificationLink.userId, userId))
				.orderBy(desc(notification.createdAt))
				.limit(limit)
				.offset(offset);

			return notifications.map((n) => ({
				...n,
				data: n.data ? JSON.parse(n.data) : null,
				readAt: n.readAt || undefined
			})) as Notification[];
		} catch (error) {
			console.error('获取用户通知失败:', error);
			return [];
		}
	}

	// 获取用户未读通知数量
	static async getUnreadCount(userId: number): Promise<number> {
		try {
			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(userNotificationLink)
				.where(and(eq(userNotificationLink.userId, userId), eq(userNotificationLink.isRead, false)));

			return count;
		} catch (error) {
			console.error('获取未读数量失败:', error);
			return 0;
		}
	}

	// 获取用户通知总数
	static async getTotalCount(userId: number): Promise<number> {
		try {
			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(userNotificationLink)
				.where(eq(userNotificationLink.userId, userId));

			return count;
		} catch (error) {
			console.error('获取通知总数失败:', error);
			return 0;
		}
	}

	// 标记通知为已读
	static async markAsRead(notificationId: number, userId: number): Promise<NotificationResult<void>> {
		try {
			await db
				.update(userNotificationLink)
				.set({
					isRead: true,
					readAt: new Date()
				})
				.where(
					and(
						eq(userNotificationLink.notificationId, notificationId),
						eq(userNotificationLink.userId, userId)
					)
				);

			return NotificationResult.success(undefined);
		} catch (error) {
			console.error('标记已读失败:', error);
			return NotificationResult.error('标记已读失败');
		}
	}

	// 标记通知为未读
	static async markAsUnread(notificationId: number, userId: number): Promise<NotificationResult<void>> {
		try {
			await db
				.update(userNotificationLink)
				.set({
					isRead: false,
					readAt: null
				})
				.where(
					and(
						eq(userNotificationLink.notificationId, notificationId),
						eq(userNotificationLink.userId, userId)
					)
				);

			return NotificationResult.success(undefined);
		} catch (error) {
			console.error('标记未读失败:', error);
			return NotificationResult.error('标记未读失败');
		}
	}

	// 批量标记通知为已读
	static async markMultipleAsRead(notificationIds: number[], userId: number): Promise<NotificationResult<void>> {
		try {
			if (notificationIds.length === 0) {
				return NotificationResult.error('通知ID列表不能为空');
			}

			await db
				.update(userNotificationLink)
				.set({
					isRead: true,
					readAt: new Date()
				})
				.where(
					and(
						inArray(userNotificationLink.notificationId, notificationIds),
						eq(userNotificationLink.userId, userId)
					)
				);

			return NotificationResult.success(undefined);
		} catch (error) {
			console.error('批量标记已读失败:', error);
			return NotificationResult.error('批量标记已读失败');
		}
	}

	// 批量标记通知为未读
	static async markMultipleAsUnread(notificationIds: number[], userId: number): Promise<NotificationResult<void>> {
		try {
			if (notificationIds.length === 0) {
				return NotificationResult.error('通知ID列表不能为空');
			}

			await db
				.update(userNotificationLink)
				.set({
					isRead: false,
					readAt: null
				})
				.where(
					and(
						inArray(userNotificationLink.notificationId, notificationIds),
						eq(userNotificationLink.userId, userId)
					)
				);

			return NotificationResult.success(undefined);
		} catch (error) {
			console.error('批量标记未读失败:', error);
			return NotificationResult.error('批量标记未读失败');
		}
	}

	// 标记所有通知为已读
	static async markAllAsRead(userId: number): Promise<NotificationResult<void>> {
		try {
			await db
				.update(userNotificationLink)
				.set({
					isRead: true,
					readAt: new Date()
				})
				.where(eq(userNotificationLink.userId, userId));

			return NotificationResult.success(undefined);
		} catch (error) {
			console.error('标记所有已读失败:', error);
			return NotificationResult.error('标记所有已读失败');
		}
	}
}
