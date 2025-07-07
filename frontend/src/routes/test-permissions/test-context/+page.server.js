import { requirePermission } from '$lib/server/middleware/permissions.js';

export async function load(event) {
    // 1. 只校验系统权限
    let systemResult = null;
    try {
        await requirePermission('system:admin')(event);
        systemResult = '有 system:admin 权限';
    } catch {
        systemResult = '无 system:admin 权限';
    }

    // 2. 校验主组织权限
    let orgResult = null;
    try {
        await requirePermission('organization:view', { organizationId: 1 })(event);
        orgResult = '有 organization:view 权限 (organizationId:1)';
    } catch {
        orgResult = '无 organization:view 权限 (organizationId:1)';
    }

    // 3. 校验子组织权限
    let subOrgResult = null;
    try {
        await requirePermission('sub_organization:manage', { subOrganizationId: 1 })(event);
        subOrgResult = '有 sub_organization:manage 权限 (subOrganizationId:1)';
    } catch {
        subOrgResult = '无 sub_organization:manage 权限 (subOrganizationId:1)';
    }

    return {
        systemResult,
        orgResult,
        subOrgResult
    };
} 