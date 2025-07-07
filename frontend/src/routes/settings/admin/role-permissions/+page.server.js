import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load() {
    // 加载所有角色（系统、主组织、子组织）
    const systemRoles = await db.select().from(table.systemRole);
    const organizationRoles = await db.select().from(table.organizationRole);
    const subOrganizationRoles = await db.select().from(table.subOrganizationRole);

    // 加载所有权限
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

    // 加载所有角色的权限分配
    const systemRolePermissions = await db.select().from(table.systemRolePermission);
    const organizationRolePermissions = await db.select().from(table.organizationRolePermission);
    const subOrganizationRolePermissions = await db.select().from(table.subOrganizationRolePermission);

    return {
        systemRoles,
        organizationRoles,
        subOrganizationRoles,
        permissions,
        systemRolePermissions,
        organizationRolePermissions,
        subOrganizationRolePermissions
    };
}

// 新增 actions
export const actions = {
    async save({ request }) {
        const form = await request.formData();
        const roleType = form.get('roleType'); // system/organization/subOrganization
        const roleId = Number(form.get('roleId'));
        const permissions = form.getAll('permissions'); // 多选

        if (!roleType || !roleId) {
            return fail(400, { error: '参数不完整' });
        }

        // 1. 先清空该角色的所有权限
        if (roleType === 'system') {
            await db.delete(table.systemRolePermission)
                .where(eq(table.systemRolePermission.systemRoleId, roleId));
            // 2. 再插入新权限
            if (permissions.length) {
                await db.insert(table.systemRolePermission).values(
                    permissions.map(permission => ({ systemRoleId: roleId, permission }))
                );
            }
        } else if (roleType === 'organization') {
            await db.delete(table.organizationRolePermission)
                .where(eq(table.organizationRolePermission.organizationRoleId, roleId));
            if (permissions.length) {
                await db.insert(table.organizationRolePermission).values(
                    permissions.map(permission => ({ organizationRoleId: roleId, permission }))
                );
            }
        } else if (roleType === 'subOrganization') {
            await db.delete(table.subOrganizationRolePermission)
                .where(eq(table.subOrganizationRolePermission.subOrganizationRoleId, roleId));
            if (permissions.length) {
                await db.insert(table.subOrganizationRolePermission).values(
                    permissions.map(permission => ({ subOrganizationRoleId: roleId, permission }))
                );
            }
        } else {
            return fail(400, { error: '未知角色类型' });
        }

        // 保存后刷新页面
        throw redirect(303, '/settings/admin/role-permissions');
    }
}; 