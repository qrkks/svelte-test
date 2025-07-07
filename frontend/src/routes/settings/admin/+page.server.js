import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { count } from 'drizzle-orm';

export async function load() {
	try {
		const [
			usersCount,
			organizationsCount,
			subOrganizationsCount,
			systemRolesCount,
			organizationRolesCount,
			subOrganizationRolesCount
		] = await Promise.all([
			db.select({ count: count() }).from(table.user),
			db.select({ count: count() }).from(table.organization),
			db.select({ count: count() }).from(table.subOrganization),
			db.select({ count: count() }).from(table.systemRole),
			db.select({ count: count() }).from(table.organizationRole),
			db.select({ count: count() }).from(table.subOrganizationRole)
		]);

		return {
			stats: {
				users: usersCount[0]?.count || 0,
				organizations: organizationsCount[0]?.count || 0,
				subOrganizations: subOrganizationsCount[0]?.count || 0,
				systemRoles: systemRolesCount[0]?.count || 0,
				organizationRoles: organizationRolesCount[0]?.count || 0,
				subOrganizationRoles: subOrganizationRolesCount[0]?.count || 0
			}
		};
	} catch (error) {
		console.error('获取统计数据失败:', error);
		return {
			stats: {
				users: 0,
				organizations: 0,
				subOrganizations: 0,
				systemRoles: 0,
				organizationRoles: 0,
				subOrganizationRoles: 0
			}
		};
	}
}
