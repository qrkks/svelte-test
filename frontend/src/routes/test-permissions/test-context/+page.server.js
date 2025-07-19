import { requirePermission } from '$lib/server/middleware/permissions.js';
import { getUserSystemPermissions, getUserOrganizationPermissions, getUserSubOrganizationPermissions } from '$lib/server/permissions.js';

export async function load(event) {
	const systemPermission = await getUserSystemPermissions(event.locals.user.id);
	const organizationPermission = await getUserOrganizationPermissions(event.locals.user.id, 1);
	const subOrganizationPermission = await getUserSubOrganizationPermissions(event.locals.user.id, 1);

	// 1. 只校验系统权限
	let systemResult = null;
	try {
		await requirePermission('system:admin')(event);
		systemResult = `有 system:admin 权限, 权限列表: ${systemPermission}`;
	} catch {
		systemResult = `无 system:admin 权限, 权限列表: ${systemPermission}`;
	}

	// 2. 校验主组织权限
	let orgResult = null;
	try {
		await requirePermission('organization:view')(event, { organizationId: 1 });
		orgResult = `有 organization:view 权限 (organizationId:1), 权限列表: ${organizationPermission}`;
	} catch {
		orgResult = `无 organization:view 权限 (organizationId:1), 权限列表: ${organizationPermission}`;
	}

	// 3. 校验子组织权限
	let subOrgResult = null;
	try {
		await requirePermission('sub_organization:manage')(event, { subOrganizationId: 1 });
		subOrgResult = `有 sub_organization:manage 权限 (subOrganizationId:1), 权限列表: ${subOrganizationPermission}`;
	} catch {
		subOrgResult = `无 sub_organization:manage 权限 (subOrganizationId:1), 权限列表: ${subOrganizationPermission}`;
	}

	return {
		systemResult,
		orgResult,
		subOrgResult
	};
}
