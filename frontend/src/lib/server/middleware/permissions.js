import { redirect } from '@sveltejs/kit';
import { checkUserPermission } from '$lib/server/permissions';

/**
 * 权限验证中间件
 * @param {string} permission - 所需权限
 * @param {Object} context - 上下文对象
 * @returns {Function} 中间件函数
 */
export function requirePermission(permission, context = {}) {
	return async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/settings/auth/login');
		}

		const hasPermission = await checkUserPermission(event.locals.user.id, permission, context);

		if (!hasPermission) {
			throw redirect(302, '/settings/auth/login?error=insufficient_permissions');
		}
	};
}

/**
 * 组织权限验证中间件
 * @param {string} permission - 所需权限
 * @returns {Function} 中间件函数
 */
export function requireOrganizationPermission(permission) {
	return async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/settings/auth/login');
		}

		const organizationId = parseInt(event.params.organizationId);
		if (!organizationId) {
			throw redirect(302, '/settings/auth/login?error=invalid_organization');
		}

		const hasPermission = await checkUserPermission(event.locals.user.id, permission, { organizationId });

		if (!hasPermission) {
			throw redirect(302, '/settings/auth/login?error=insufficient_permissions');
		}
	};
}

/**
 * 子组织权限验证中间件
 * @param {string} permission - 所需权限
 * @returns {Function} 中间件函数
 */
export function requireSubOrganizationPermission(permission) {
	return async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/settings/auth/login');
		}

		const organizationId = parseInt(event.params.organizationId);
		const subOrganizationId = parseInt(event.params.subOrganizationId);

		if (!organizationId || !subOrganizationId) {
			throw redirect(302, '/settings/auth/login?error=invalid_organization');
		}

		const hasPermission = await checkUserPermission(event.locals.user.id, permission, {
			organizationId,
			subOrganizationId
		});

		if (!hasPermission) {
			throw redirect(302, '/settings/auth/login?error=insufficient_permissions');
		}
	};
}

/**
 * 系统权限验证中间件
 * @param {string} permission - 所需权限
 * @returns {Function} 中间件函数
 */
export function requireSystemPermission(permission) {
	return async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/settings/auth/login');
		}

		const hasPermission = await checkUserPermission(event.locals.user.id, permission);

		if (!hasPermission) {
			throw redirect(302, '/settings/auth/login?error=insufficient_permissions');
		}
	};
} 