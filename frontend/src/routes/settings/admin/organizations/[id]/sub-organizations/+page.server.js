import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { eq, desc, and } from 'drizzle-orm';

export async function load({ params }) {
	const organizationId = Number(params.id);

	if (!organizationId) {
		throw error(400, '组织ID无效');
	}

	// 加载主组织信息
	const organization = await db
		.select()
		.from(table.organization)
		.where(eq(table.organization.id, organizationId))
		.limit(1);

	if (!organization.length) {
		throw error(404, '组织不存在');
	}

	// 加载该组织的所有子组织
	const subOrganizations = await db
		.select()
		.from(table.subOrganization)
		.where(eq(table.subOrganization.organizationId, organizationId))
		.orderBy(desc(table.subOrganization.createdAt));

	// 加载子组织类型选项
	const subOrganizationTypes = [
		{ value: 'committee', label: '专委会' },
		{ value: 'department', label: '部门' },
		{ value: 'subsidiary', label: '子公司' }
	];

	// 加载状态选项
	const statusOptions = [
		{ value: 'active', label: '活跃' },
		{ value: 'inactive', label: '非活跃' },
		{ value: 'suspended', label: '暂停' }
	];

	return {
		organization: organization[0],
		subOrganizations,
		subOrganizationTypes,
		statusOptions
	};
}

export const actions = {
	// 创建新子组织
	async create({ request, params }) {
		const form = await request.formData();
		const name = form.get('name');
		const type = form.get('type');
		const description = form.get('description');
		const status = form.get('status') || 'active';
		const organizationId = Number(params.id);

		if (!name || !type || !organizationId) {
			return fail(400, { error: '名称、类型和组织ID是必填项' });
		}

		try {
			await db.insert(table.subOrganization).values({
				name: name.toString(),
				type: type.toString(),
				description: description?.toString() || null,
				status: status.toString(),
				organizationId
			});

			throw redirect(303, `/settings/admin/organizations/${organizationId}/sub-organizations`);
		} catch (err) {
			if (err?.message?.includes('UNIQUE constraint failed')) {
				return fail(400, { error: '子组织名称已存在' });
			}
			return fail(500, { error: '创建子组织失败' });
		}
	},

	// 更新子组织
	async update({ request, params }) {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const name = form.get('name');
		const type = form.get('type');
		const description = form.get('description');
		const status = form.get('status');
		const organizationId = Number(params.id);

		if (!id || !name || !type) {
			return fail(400, { error: 'ID、名称和类型是必填项' });
		}

		try {
			await db
				.update(table.subOrganization)
				.set({
					name: name.toString(),
					type: type.toString(),
					description: description?.toString() || null,
					status: status?.toString() || 'active',
					updatedAt: new Date()
				})
				.where(
					and(
						eq(table.subOrganization.id, id),
						eq(table.subOrganization.organizationId, organizationId)
					)
				);

			throw redirect(303, `/settings/admin/organizations/${organizationId}/sub-organizations`);
		} catch (err) {
			if (err?.message?.includes('UNIQUE constraint failed')) {
				return fail(400, { error: '子组织名称已存在' });
			}
			return fail(500, { error: '更新子组织失败' });
		}
	},

	// 删除子组织
	async delete({ request, params }) {
		const form = await request.formData();
		const id = Number(form.get('id'));
		const organizationId = Number(params.id);

		if (!id) {
			return fail(400, { error: '子组织ID是必填项' });
		}

		try {
			// 检查是否有用户关联
			const userRoles = await db
				.select()
				.from(table.userSubOrganizationRoleMap)
				.where(eq(table.userSubOrganizationRoleMap.subOrganizationId, id));

			if (userRoles.length > 0) {
				return fail(400, { error: '无法删除有用户关联的子组织' });
			}

			const result = await db
				.delete(table.subOrganization)
				.where(
					and(
						eq(table.subOrganization.id, id),
						eq(table.subOrganization.organizationId, organizationId)
					)
				);

			// drizzle-orm sqlite 返回 { changes: n }，postgres 返回 rowCount
			if ((result && result.changes === 0) || (result && result.rowCount === 0)) {
				return fail(400, { error: '子组织不存在或已被删除' });
			}

			throw redirect(303, `/settings/admin/organizations/${organizationId}/sub-organizations`);
		} catch (err) {
			console.error('删除子组织失败', err);
			return fail(500, { error: '删除子组织失败' });
		}
	}
}; 