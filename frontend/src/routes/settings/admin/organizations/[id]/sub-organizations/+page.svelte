<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	// 响应式状态
	let showCreateModal = $state(false);
	let showEditModal = $state(false);

	// 表单数据
	let createForm = $state({
		name: '',
		type: 'committee',
		description: '',
		status: 'active'
	});

	let editForm = $state({
		id: null,
		name: '',
		type: 'committee',
		description: '',
		status: 'active'
	});

	// 计算属性
	let organization = $derived(data.organization);
	let subOrganizations = $derived(data.subOrganizations || []);
	let subOrganizationTypes = $derived(data.subOrganizationTypes || []);
	let statusOptions = $derived(data.statusOptions || []);

	// 方法
	function openCreateModal() {
		createForm = {
			name: '',
			type: 'committee',
			description: '',
			status: 'active'
		};
		showCreateModal = true;
	}

	function openEditModal(subOrganization) {
		editForm = {
			id: subOrganization.id,
			name: subOrganization.name,
			type: subOrganization.type,
			description: subOrganization.description || '',
			status: subOrganization.status
		};
		showEditModal = true;
	}

	function deleteSubOrganization(subOrganization) {
		if (window.confirm(`确定要删除子组织 “${subOrganization.name}” 吗？此操作不可撤销。`)) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '?/delete';
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'id';
			input.value = subOrganization.id;
			form.appendChild(input);
			document.body.appendChild(form);
			form.submit();
		}
	}

	function closeModals() {
		showCreateModal = false;
		showEditModal = false;
	}

	// 监听表单错误
	$effect(() => {
		if (form?.error) {
			alert(form.error);
		}
	});

	// 获取状态标签样式
	function getStatusClass(status) {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-gray-100 text-gray-800';
			case 'suspended':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// 获取类型标签样式
	function getTypeClass(type) {
		switch (type) {
			case 'committee':
				return 'bg-blue-100 text-blue-800';
			case 'department':
				return 'bg-purple-100 text-purple-800';
			case 'subsidiary':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// 格式化日期
	function formatDate(dateString) {
		return new Date(dateString).toLocaleString('zh-CN');
	}
</script>

<svelte:head>
	<title>子组织管理 - {organization?.name} - 系统设置</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- 面包屑导航 -->
	<div class="mb-4 flex items-center space-x-2 text-sm text-gray-600">
		<a href="/settings/admin/organizations" class="hover:text-blue-600">组织管理</a>
		<span>/</span>
		<span>{organization?.name}</span>
		<span>/</span>
		<span class="text-gray-900">子组织</span>
	</div>

	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold">子组织管理</h1>
			<p class="text-gray-600">
				管理组织 <span class="font-semibold text-blue-600">{organization?.name}</span> 的子组织
			</p>
		</div>
		<div class="flex space-x-3">
			<a
				href="/settings/admin/organizations"
				class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				返回组织列表
			</a>
			<button
				type="button"
				onclick={openCreateModal}
				class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				创建子组织
			</button>
		</div>
	</div>

	<!-- 子组织列表 -->
	<div class="overflow-hidden rounded-lg border shadow-sm">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						子组织名称
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						类型
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						状态
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						描述
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						创建时间
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
						操作
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each subOrganizations as subOrganization}
					<tr class="hover:bg-gray-50">
						<td class="whitespace-nowrap px-6 py-4">
							<div class="text-sm font-medium text-gray-900">{subOrganization.name}</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium {getTypeClass(subOrganization.type)}"
							>
								{subOrganizationTypes.find(t => t.value === subOrganization.type)?.label || subOrganization.type}
							</span>
						</td>
						<td class="whitespace-nowrap px-6 py-4">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium {getStatusClass(subOrganization.status)}"
							>
								{statusOptions.find(s => s.value === subOrganization.status)?.label || subOrganization.status}
							</span>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm text-gray-900">
								{subOrganization.description || '-'}
							</div>
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
							{formatDate(subOrganization.createdAt)}
						</td>
						<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
							<div class="flex space-x-2">
								<button
									type="button"
									onclick={() => openEditModal(subOrganization)}
									class="text-blue-600 hover:text-blue-900"
								>
									编辑
								</button>
								<button
									type="button"
									onclick={() => deleteSubOrganization(subOrganization)}
									class="text-red-600 hover:text-red-900"
								>
									删除
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if subOrganizations.length === 0}
			<div class="px-6 py-12 text-center">
				<div class="text-gray-500">暂无子组织数据</div>
				<button
					type="button"
					onclick={openCreateModal}
					class="mt-2 text-blue-600 hover:text-blue-900"
				>
					创建第一个子组织
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- 创建子组织模态框 -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-semibold">创建子组织</h2>
			<form method="POST" action="?/create" use:enhance>
				<div class="mb-4">
					<label for="name" class="block text-sm font-medium text-gray-700">子组织名称</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={createForm.name}
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					/>
				</div>

				<div class="mb-4">
					<label for="type" class="block text-sm font-medium text-gray-700">子组织类型</label>
					<select
						id="type"
						name="type"
						bind:value={createForm.type}
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					>
						{#each subOrganizationTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<div class="mb-4">
					<label for="description" class="block text-sm font-medium text-gray-700">描述</label>
					<textarea
						id="description"
						name="description"
						bind:value={createForm.description}
						rows="3"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					></textarea>
				</div>

				<div class="mb-6">
					<label for="status" class="block text-sm font-medium text-gray-700">状态</label>
					<select
						id="status"
						name="status"
						bind:value={createForm.status}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					>
						{#each statusOptions as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						onclick={closeModals}
						class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						取消
					</button>
					<button
						type="submit"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						创建
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 编辑子组织模态框 -->
{#if showEditModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-semibold">编辑子组织</h2>
			<form method="POST" action="?/update" use:enhance>
				<input type="hidden" name="id" value={editForm.id} />
				
				<div class="mb-4">
					<label for="edit-name" class="block text-sm font-medium text-gray-700">子组织名称</label>
					<input
						type="text"
						id="edit-name"
						name="name"
						bind:value={editForm.name}
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					/>
				</div>

				<div class="mb-4">
					<label for="edit-type" class="block text-sm font-medium text-gray-700">子组织类型</label>
					<select
						id="edit-type"
						name="type"
						bind:value={editForm.type}
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					>
						{#each subOrganizationTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<div class="mb-4">
					<label for="edit-description" class="block text-sm font-medium text-gray-700">描述</label>
					<textarea
						id="edit-description"
						name="description"
						bind:value={editForm.description}
						rows="3"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					></textarea>
				</div>

				<div class="mb-6">
					<label for="edit-status" class="block text-sm font-medium text-gray-700">状态</label>
					<select
						id="edit-status"
						name="status"
						bind:value={editForm.status}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					>
						{#each statusOptions as status}
							<option value={status.value}>{status.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						onclick={closeModals}
						class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						取消
					</button>
					<button
						type="submit"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						保存
					</button>
				</div>
			</form>
		</div>
	</div>
{/if} 