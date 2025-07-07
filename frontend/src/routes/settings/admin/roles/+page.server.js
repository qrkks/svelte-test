import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

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
}