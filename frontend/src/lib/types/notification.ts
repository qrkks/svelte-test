// 通知系统类型定义

export type NotificationType = 'individual' | 'group';
export type NotificationTargetType = 'all_users' | 'organization' | 'role' | 'sub_organization' | 'custom';

export interface NotificationTarget {
	type: NotificationTargetType;
	id?: number;
	conditions?: any; // 暂时保持any，后续可以细化
}

export interface Notification {
	id: number;
	type: NotificationType;
	title: string;
	content: string;
	data?: any;
	isImportant: boolean;
	createdAt: string;
	isRead?: boolean;
	readAt?: string | Date;
}

export interface SendIndividualNotificationData {
	userId: number;
	title: string;
	content: string;
	data?: any;
	isImportant?: boolean;
}

export interface SendGroupNotificationData {
	title: string;
	content: string;
	targets: NotificationTarget[];
	data?: any;
	isImportant?: boolean;
}

// 结果类型，用于统一错误处理
export class NotificationResult<T> {
	constructor(
		public success: boolean,
		public data?: T,
		public error?: string
	) {}

	static success<T>(data: T): NotificationResult<T> {
		return new NotificationResult(true, data);
	}

	static error<T>(message: string): NotificationResult<T> {
		return new NotificationResult<T>(false, undefined, message);
	}
}

// 目标类型配置
export const TARGET_TYPES = {
	ALL_USERS: 'all_users',
	ORGANIZATION: 'organization',
	ROLE: 'role',
	SUB_ORGANIZATION: 'sub_organization',
	CUSTOM: 'custom'
} as const;

export const TARGET_TYPE_CONFIG = {
	[TARGET_TYPES.ALL_USERS]: {
		requiresId: false,
		requiresConditions: false,
		label: '所有用户'
	},
	[TARGET_TYPES.ORGANIZATION]: {
		requiresId: true,
		requiresConditions: false,
		label: '指定组织'
	},
	[TARGET_TYPES.ROLE]: {
		requiresId: true,
		requiresConditions: false,
		label: '指定角色'
	},
	[TARGET_TYPES.SUB_ORGANIZATION]: {
		requiresId: true,
		requiresConditions: false,
		label: '子组织'
	},
	[TARGET_TYPES.CUSTOM]: {
		requiresId: false,
		requiresConditions: true,
		label: '自定义条件'
	}
} as const; 