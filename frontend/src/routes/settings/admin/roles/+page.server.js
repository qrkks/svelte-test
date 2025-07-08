import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    try {
        const [systemRoles, organizationRoles, subOrganizationRoles] = await Promise.all([
            db.select().from(table.systemRole).orderBy(table.systemRole.name),
            db.select().from(table.organizationRole).orderBy(table.organizationRole.name),
            db.select().from(table.subOrganizationRole).orderBy(table.subOrganizationRole.name)
        ]);

        return {
            systemRoles,
            organizationRoles,
            subOrganizationRoles
        };
    } catch (error) {
        console.error('加载角色数据失败:', error);
        return {
            systemRoles: [],
            organizationRoles: [],
            subOrganizationRoles: []
        };
    }
};

export const actions = {
    save: async ({ request }) => {
        const formData = await request.formData();
        const roleType = formData.get('roleType');
        const roleId = formData.get('roleId');
        const name = formData.get('name');
        const description = formData.get('description');

        if (!name || !roleType) {
            return fail(400, { error: '角色名称和类型不能为空' });
        }

        try {
            if (roleId) {
                // 更新角色
                switch (roleType) {
                    case 'system':
                        await db.update(table.systemRole)
                            .set({ name, description })
                            .where(eq(table.systemRole.id, parseInt(roleId)));
                        break;
                    case 'organization':
                        await db.update(table.organizationRole)
                            .set({ name, description })
                            .where(eq(table.organizationRole.id, parseInt(roleId)));
                        break;
                    case 'subOrganization':
                        await db.update(table.subOrganizationRole)
                            .set({ name, description })
                            .where(eq(table.subOrganizationRole.id, parseInt(roleId)));
                        break;
                }
            } else {
                // 创建角色
                switch (roleType) {
                    case 'system':
                        await db.insert(table.systemRole).values({ name, description });
                        break;
                    case 'organization':
                        await db.insert(table.organizationRole).values({ name, description });
                        break;
                    case 'subOrganization':
                        await db.insert(table.subOrganizationRole).values({ name, description });
                        break;
                }
            }
            return { success: true };
        } catch (error) {
            console.error('保存角色失败:', error);
            return fail(500, { error: '保存角色失败' });
        }
    },
    delete: async ({ request }) => {
        const formData = await request.formData();
        const roleType = formData.get('roleType');
        const roleId = formData.get('roleId');
        if (!roleId || !roleType) {
            return fail(400, { error: '角色ID和类型不能为空' });
        }
        try {
            switch (roleType) {
                case 'system':
                    await db.delete(table.systemRole).where(eq(table.systemRole.id, parseInt(roleId)));
                    break;
                case 'organization':
                    await db.delete(table.organizationRole).where(eq(table.organizationRole.id, parseInt(roleId)));
                    break;
                case 'subOrganization':
                    await db.delete(table.subOrganizationRole).where(eq(table.subOrganizationRole.id, parseInt(roleId)));
                    break;
            }
            return { success: true };
        } catch (error) {
            console.error('删除角色失败:', error);
            return fail(500, { error: '删除角色失败' });
        }
    }
};