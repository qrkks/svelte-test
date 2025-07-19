import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export async function load() {
	// 加载所有主组织
	const organizations = await db
		.select()
		.from(table.organization)
		.orderBy(desc(table.organization.createdAt));

	// 加载组织类型选项
	const organizationTypes = [
		{ value: 'association', label: '协会' },
		{ value: 'company', label: '公司' },
		{ value: 'group', label: '集团' }
	];

	// 加载状态选项
	const statusOptions = [
		{ value: 'active', label: '活跃' },
		{ value: 'inactive', label: '非活跃' },
		{ value: 'suspended', label: '暂停' }
	];

	return {
		organizations,
		organizationTypes,
		statusOptions
	};
}

export const actions = {
	// 创建新组织
	async create({ request }) {
		const form = await request.formData();
		const name = form.get('name');
		const type = form.get('type');
		const description = form.get('description');
		const status = form.get('status') || 'active';

		if (!name || !type) {
			return fail(400, { error: '名称和类型是必填项' });
		}

		try {
			await db.insert(table.organization).values({
				name: name.toString(),
				type: type.toString(),
				description: description?.toString() || null,
				status: status.toString()
			});

			throw redirect(303, '/settings/admin/organizations');
		} catch (error) {
			if (error.message.includes('UNIQUE constraint failed')) {
				return fail(400, { error: '组织名称已存在' });
			}
			return fail(500, { error: '创建组织失败' });
		}
	},

	// 更新组织
	async update({ request }) {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const name = form.get('name');
		const type = form.get('type');
		const description = form.get('description');
		const status = form.get('status');

		if (!id || !name || !type) {
			return fail(400, { error: 'ID、名称和类型是必填项' });
		}

		try {
			await db
				.update(table.organization)
				.set({
					name: name.toString(),
					type: type.toString(),
					description: description?.toString() || null,
					status: status?.toString() || 'active',
					updatedAt: new Date()
				})
				.where(eq(table.organization.id, id));

			throw redirect(303, '/settings/admin/organizations');
		} catch (error) {
			if (error.message.includes('UNIQUE constraint failed')) {
				return fail(400, { error: '组织名称已存在' });
			}
			return fail(500, { error: '更新组织失败' });
		}
	},

	// 删除组织
	async delete({ request }) {
		const form = await request.formData();
		const id = Number(form.get('id'));

		if (!id) {
			return fail(400, { error: '组织ID是必填项' });
		}

		try {
			// 检查是否有子组织
			const subOrganizations = await db
				.select()
				.from(table.subOrganization)
				.where(eq(table.subOrganization.organizationId, id));

			if (subOrganizations.length > 0) {
				return fail(400, { error: '无法删除包含子组织的组织' });
			}

			// 检查是否有用户关联
			const userRoles = await db
				.select()
				.from(table.userOrganizationRoleMap)
				.where(eq(table.userOrganizationRoleMap.organizationId, id));

			if (userRoles.length > 0) {
				return fail(400, { error: '无法删除有用户关联的组织' });
			}

			await db.delete(table.organization).where(eq(table.organization.id, id));

			throw redirect(303, '/settings/admin/organizations');
		} catch {
			return fail(500, { error: '删除组织失败' });
		}
	}
}; 