import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

/**
 * 三级权限验证函数
 * @param {number} userId - 用户ID
 * @param {string} permission - 权限字符串
 * @param {Object} context - 上下文对象
 * @param {number} context.organizationId - 主组织ID
 * @param {number} context.subOrganizationId - 子组织ID
 * @returns {Promise<boolean>} 是否有权限
 */
export async function checkUserPermission(userId, permission, context = {}) {
	const { organizationId, subOrganizationId } = context;

	// 1. 检查用户系统角色权限（最高级）
	const systemPermissions = await getUserSystemPermissions(userId);
	if (systemPermissions.includes(permission)) {
		return true;
	}

	// 2. 检查主组织角色权限（中间级）
	if (organizationId) {
		const organizationPermissions = await getUserOrganizationPermissions(userId, organizationId);
		if (organizationPermissions.includes(permission)) {
			return true;
		}
	}

	// 3. 检查子组织角色权限（最低级）
	if (subOrganizationId) {
		const subOrganizationPermissions = await getUserSubOrganizationPermissions(
			userId,
			subOrganizationId
		);
		if (subOrganizationPermissions.includes(permission)) {
			return true;
		}
	}

	return false;
}

/**
 * 获取用户系统权限
 * @param {number} userId - 用户ID
 * @returns {Promise<string[]>} 系统权限数组
 */
export async function getUserSystemPermissions(userId) {
	const result = await db
		.select({ permission: table.systemRolePermission.permission })
		.from(table.userSystemRole)
		.innerJoin(
			table.systemRolePermission,
			eq(table.userSystemRole.systemRoleId, table.systemRolePermission.systemRoleId)
		)
		.where(eq(table.userSystemRole.userId, userId));

	return result.map((r) => r.permission);
}

/**
 * 获取用户主组织权限
 * @param {number} userId - 用户ID
 * @param {number} organizationId - 主组织ID
 * @returns {Promise<string[]>} 主组织权限数组
 */
export async function getUserOrganizationPermissions(userId, organizationId) {
	const result = await db
		.select({ permission: table.organizationRolePermission.permission })
		.from(table.userOrganizationRole)
		.innerJoin(
			table.organizationRolePermission,
			eq(
				table.userOrganizationRole.organizationRoleId,
				table.organizationRolePermission.organizationRoleId
			)
		)
		.where(
			and(
				eq(table.userOrganizationRole.userId, userId),
				eq(table.userOrganizationRole.organizationId, organizationId)
			)
		);

	return result.map((r) => r.permission);
}

/**
 * 获取用户子组织权限
 * @param {number} userId - 用户ID
 * @param {number} subOrganizationId - 子组织ID
 * @returns {Promise<string[]>} 子组织权限数组
 */
export async function getUserSubOrganizationPermissions(userId, subOrganizationId) {
	const result = await db
		.select({ permission: table.subOrganizationRolePermission.permission })
		.from(table.userSubOrganizationRole)
		.innerJoin(
			table.subOrganizationRolePermission,
			eq(
				table.userSubOrganizationRole.subOrganizationRoleId,
				table.subOrganizationRolePermission.subOrganizationRoleId
			)
		)
		.where(
			and(
				eq(table.userSubOrganizationRole.userId, userId),
				eq(table.userSubOrganizationRole.subOrganizationId, subOrganizationId)
			)
		);

	return result.map((r) => r.permission);
}

/**
 * 获取用户所属的所有主组织
 * @param {number} userId - 用户ID
 * @returns {Promise<Array<{
 *   organizationId: number,
 *   organizationName: string,
 *   organizationType: string,
 *   roleName: string,
 *   roleDescription: string
 * }>>} 用户所属的主组织列表
 */
export async function getUserOrganizations(userId) {
	const result = await db
		.select({
			organizationId: table.organization.id,
			organizationName: table.organization.name,
			organizationType: table.organization.type,
			roleName: table.organizationRole.name,
			roleDescription: table.organizationRole.description
		})
		.from(table.userOrganizationRole)
		.innerJoin(
			table.organization,
			eq(table.userOrganizationRole.organizationId, table.organization.id)
		)
		.innerJoin(
			table.organizationRole,
			eq(table.userOrganizationRole.organizationRoleId, table.organizationRole.id)
		)
		.where(eq(table.userOrganizationRole.userId, userId));

	return result;
}

/**
 * 获取用户所属的所有子组织
 * @param {number} userId - 用户ID
 * @param {number|null} organizationId - 主组织ID（可选，用于过滤）
 * @returns {Promise<Array<{
 *   subOrganizationId: number,
 *   subOrganizationName: string,
 *   subOrganizationType: string,
 *   organizationId: number,
 *   organizationName: string,
 *   roleName: string,
 *   roleDescription: string
 * }>>} 用户所属的子组织列表
 */
export async function getUserSubOrganizations(userId, organizationId = null) {
	let query = db
		.select({
			subOrganizationId: table.subOrganization.id,
			subOrganizationName: table.subOrganization.name,
			subOrganizationType: table.subOrganization.type,
			organizationId: table.subOrganization.organizationId,
			organizationName: table.organization.name,
			roleName: table.subOrganizationRole.name,
			roleDescription: table.subOrganizationRole.description
		})
		.from(table.userSubOrganizationRole)
		.innerJoin(
			table.subOrganization,
			eq(table.userSubOrganizationRole.subOrganizationId, table.subOrganization.id)
		)
		.innerJoin(table.organization, eq(table.subOrganization.organizationId, table.organization.id))
		.innerJoin(
			table.subOrganizationRole,
			eq(table.userSubOrganizationRole.subOrganizationRoleId, table.subOrganizationRole.id)
		)
		.where(eq(table.userSubOrganizationRole.userId, userId));

	if (organizationId) {
		query = query.where(eq(table.subOrganization.organizationId, organizationId));
	}

	const result = await query;
	return result;
}

/**
 * 获取用户所有权限（用于调试）
 * @param {number} userId - 用户ID
 * @returns {Promise<{
 *   system: string[],
 *   organizations: Array<{
 *     organizationId: number,
 *     organizationName: string,
 *     organizationType: string,
 *     roleName: string,
 *     roleDescription: string,
 *     permissions: string[],
 *     subOrganizations: Array<{
 *       subOrganizationId: number,
 *       subOrganizationName: string,
 *       subOrganizationType: string,
 *       organizationId: number,
 *       organizationName: string,
 *       roleName: string,
 *       roleDescription: string,
 *       permissions: string[]
 *     }>
 *   }>
 * }>} 用户的所有权限信息
 */
export async function getAllUserPermissions(userId) {
	const systemPermissions = await getUserSystemPermissions(userId);
	const organizations = await getUserOrganizations(userId);
	
	const allPermissions = {
		system: systemPermissions,
		organizations: []
	};

	for (const org of organizations) {
		const orgPermissions = await getUserOrganizationPermissions(userId, org.organizationId);
		const subOrgs = await getUserSubOrganizations(userId, org.organizationId);
		
		allPermissions.organizations.push({
			...org,
			permissions: orgPermissions,
			subOrganizations: subOrgs.map(subOrg => ({
				...subOrg,
				permissions: [] // 这里可以添加子组织权限
			}))
		});
	}

	return allPermissions;
}