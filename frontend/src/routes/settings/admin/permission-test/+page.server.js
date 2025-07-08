import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getAllUserPermissions, checkUserPermission } from '$lib/server/permissions';

export async function load({ locals }) {
	if (!locals.user) {
		return {
			user: null,
			userPermissions: null,
			users: [],
			organizations: [],
			subOrganizations: [],
			permissions: []
		};
	}

	// 获取当前用户的所有权限
	const userPermissions = await getAllUserPermissions(locals.user.id);

	// 加载所有用户（用于测试）
	const users = await db.select().from(table.user).limit(10);

	// 加载所有组织
	const organizations = await db.select().from(table.organization);

	// 加载所有子组织
	const subOrganizations = await db.select().from(table.subOrganization);

	// 定义所有权限
	const permissions = [
		// 系统权限
		'system:admin',
		'system:config',
		'system:user_manage',
		// 主组织权限
		'organization:manage',
		'organization:view',
		'organization:edit',
		'sub_organization:create',
		'sub_organization:manage',
		'sub_organization:view',
		// 子组织权限
		'sub_organization:manage',
		'sub_organization:view',
		'sub_organization:edit',
		'sub_organization:approve',
		'sub_organization:delete'
	];

	return {
		user: locals.user,
		userPermissions,
		users,
		organizations,
		subOrganizations,
		permissions
	};
}

export const actions = {
	// 测试权限
	async testPermission({ request }) {
		const form = await request.formData();
		const userId = Number(form.get('userId'));
		const permission = form.get('permission');
		const organizationId = form.get('organizationId') ? Number(form.get('organizationId')) : null;
		const subOrganizationId = form.get('subOrganizationId') ? Number(form.get('subOrganizationId')) : null;

		if (!userId || !permission) {
			return { success: false, error: '用户ID和权限是必填项' };
		}

		try {
			const hasPermission = await checkUserPermission(userId, permission, {
				organizationId,
				subOrganizationId
			});

			return {
				success: true,
				result: hasPermission,
				context: {
					userId,
					permission,
					organizationId,
					subOrganizationId
				}
			};
		} catch (error) {
			return { success: false, error: error.message };
		}
	}
}; 