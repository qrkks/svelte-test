import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export async function load() {
    // 查询所有用户
    const users = await db.select().from(table.user);

    // 查询所有系统、主组织、子组织角色
    const systemRoles = await db.select().from(table.systemRole);
    const organizationRoles = await db.select().from(table.organizationRole);
    const subOrganizationRoles = await db.select().from(table.subOrganizationRole);

    // 查询所有主组织、子组织
    const organizations = await db.select().from(table.organization);
    const subOrganizations = await db.select().from(table.subOrganization);

    // 查询所有用户-角色分配
    const userSystemRoles = await db.select().from(table.userSystemRoleLink);
    const userOrganizationRoles = await db.select().from(table.userOrganizationRoleMap);
    const userSubOrganizationRoles = await db.select().from(table.userSubOrganizationRoleMap);

    return {
        users,
        systemRoles,
        organizationRoles,
        subOrganizationRoles,
        organizations,
        subOrganizations,
        userSystemRoles,
        userOrganizationRoles,
        userSubOrganizationRoles
    };
}

export const actions = {
    async save({ request }) {
        const form = await request.formData();
        const userId = Number(form.get('userId'));
        const systemRoleIds = form.getAll('systemRoleIds').map(Number);
        const organizationRolePairs = form.getAll('organizationRolePairs'); // 格式: orgId-roleId
        const subOrganizationRolePairs = form.getAll('subOrganizationRolePairs'); // 格式: subOrgId-roleId

        if (!userId) {
            return fail(400, { error: '参数不完整' });
        }

        // 1. 系统角色分配
        await db.delete(table.userSystemRoleLink).where(eq(table.userSystemRoleLink.userId, userId));
        if (systemRoleIds.length) {
            await db.insert(table.userSystemRoleLink).values(
                systemRoleIds.map(roleId => ({ userId, systemRoleId: roleId }))
            );
        }

        // 2. 主组织角色分配
        await db.delete(table.userOrganizationRoleMap).where(eq(table.userOrganizationRoleMap.userId, userId));
        for (const pair of organizationRolePairs) {
            const [orgId, roleId] = pair.split('-').map(Number);
            await db.insert(table.userOrganizationRoleMap).values({
                userId,
                organizationId: orgId,
                organizationRoleId: roleId
            });
        }

        // 3. 子组织角色分配
        await db.delete(table.userSubOrganizationRoleMap).where(eq(table.userSubOrganizationRoleMap.userId, userId));
        for (const pair of subOrganizationRolePairs) {
            const [subOrgId, roleId] = pair.split('-').map(Number);
            await db.insert(table.userSubOrganizationRoleMap).values({
                userId,
                subOrganizationId: subOrgId,
                subOrganizationRoleId: roleId
            });
        }

        throw redirect(303, '/settings/admin/user-roles');
    }
}; 