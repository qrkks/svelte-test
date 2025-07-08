<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/state/global/toast.svelte.js';

	let { data, form } = $props();
	// let { users, systemRoles, organizationRoles, subOrganizationRoles } = data;
	let users = $derived(data.users);
	let systemRoles = $derived(data.systemRoles);
	let organizationRoles = $derived(data.organizationRoles);
	let subOrganizationRoles = $derived(data.subOrganizationRoles);

	// 编辑状态
	let editingUser = $state(null);
	let showCreateForm = $state(false);

	// 表单数据
	let createForm = $state({
		username: '',
		password: '',
		email: '',
		mobile: '',
		age: ''
	});

	let editForm = $state({
		id: '',
		username: '',
		email: '',
		mobile: '',
		age: ''
	});

	// 处理创建用户
	function handleCreate() {
		showCreateForm = true;
		editingUser = null;
	}

	// 处理编辑用户
	function handleEdit(user) {
		editingUser = user;
		showCreateForm = false;
		editForm = {
			id: user.id.toString(),
			username: user.username || '',
			email: user.email || '',
			mobile: user.mobile || '',
			age: user.age ? user.age.toString() : ''
		};
	}

	// 处理取消编辑
	function handleCancel() {
		editingUser = null;
		showCreateForm = false;
	}

	// 格式化日期
	function formatDate(ts) {
	// 如果是秒级时间戳，自动转换为毫秒
	if (ts < 1e12) ts = ts * 1000;

	const date = new Date(ts);
	return date.toLocaleString('zh-CN');
}

</script>

<svelte:head>
	<title>用户管理 - 系统管理</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold">用户管理</h1>
			<p class="text-gray-600">管理系统用户账户和信息</p>
		</div>
		<button
			onclick={handleCreate}
			class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
		>
			创建用户
		</button>
	</div>

	{#if form?.error}
		<div class="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
			{form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-4 rounded-lg bg-green-50 p-4 text-green-700">操作成功</div>
	{/if}

	<!-- 创建用户表单 -->
	{#if showCreateForm}
		<div class="mb-8 rounded-lg border bg-gray-50 p-6">
			<h3 class="mb-4 text-lg font-semibold">创建新用户</h3>
			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							await invalidateAll();
							// 重置状态
							editingUser = null;
							showCreateForm = false;
							createForm = {
								username: '',
								password: '',
								email: '',
								mobile: '',
								age: ''
							};
							editForm = {
								id: '',
								username: '',
								email: '',
								mobile: '',
								age: ''
							};
						}
					};
				}}
			>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700">用户名 *</label>
						<input
							type="text"
							id="username"
							name="username"
							bind:value={createForm.username}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700">密码 *</label>
						<input
							type="password"
							id="password"
							name="password"
							bind:value={createForm.password}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">邮箱</label>
						<input
							type="email"
							id="email"
							name="email"
							bind:value={createForm.email}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="mobile" class="block text-sm font-medium text-gray-700">手机号</label>
						<input
							type="tel"
							id="mobile"
							name="mobile"
							bind:value={createForm.mobile}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="age" class="block text-sm font-medium text-gray-700">年龄</label>
						<input
							type="number"
							id="age"
							name="age"
							bind:value={createForm.age}
							min="1"
							max="150"
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						/>
					</div>
				</div>
				<div class="mt-4 flex gap-2">
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						创建用户
					</button>
					<button
						type="button"
						onclick={handleCancel}
						class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
					>
						取消
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- 用户列表 -->
	<div class="overflow-hidden rounded-lg border shadow-sm">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							ID
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							用户名
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							邮箱
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							手机号
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							年龄
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							创建时间
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							最后登录
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							操作
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each users as user}
						<tr class="hover:bg-gray-50">
							{#if editingUser?.id === user.id}
								<!-- 编辑模式 -->
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.id}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									<input
										type="text"
										name="username"
										bind:value={editForm.username}
										class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
									/>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									<input
										type="email"
										name="email"
										bind:value={editForm.email}
										class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
									/>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									<input
										type="tel"
										name="mobile"
										bind:value={editForm.mobile}
										class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
									/>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									<input
										type="number"
										name="age"
										bind:value={editForm.age}
										min="1"
										max="150"
										class="w-full rounded border border-gray-300 px-2 py-1 text-sm"
									/>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{user.createdAt}
									<!-- {formatDate(user.createdAt)} -->
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{formatDate(user.lastLoginAt)}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
									<form
										method="POST"
										action="?/update"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													await invalidateAll();
													// 重置状态
													editingUser = null;
													showCreateForm = false;
													createForm = {
														username: '',
														password: '',
														email: '',
														mobile: '',
														age: ''
													};
													editForm = {
														id: '',
														username: '',
														email: '',
														mobile: '',
														age: ''
													};
												}
											};
										}}
										class="inline"
									>
										<input type="hidden" name="id" value={editForm.id} />
										<input type="hidden" name="username" value={editForm.username} />
										<input type="hidden" name="email" value={editForm.email} />
										<input type="hidden" name="mobile" value={editForm.mobile} />
										<input type="hidden" name="age" value={editForm.age} />
										<button
											type="submit"
											class="mr-2 rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
										>
											保存
										</button>
									</form>
									<button
										onclick={handleCancel}
										class="rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
									>
										取消
									</button>
								</td>
							{:else}
								<!-- 显示模式 -->
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.id}</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
									{user.username}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{user.email || '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{user.mobile || '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{user.age || '-'}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{formatDate(user.createdAt)}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{formatDate(user.lastLoginAt)}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
									<button
										onclick={() => handleEdit(user)}
										class="mr-2 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
									>
										编辑
									</button>
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													await invalidateAll();
													// 重置状态
													editingUser = null;
													showCreateForm = false;
													createForm = {
														username: '',
														password: '',
														email: '',
														mobile: '',
														age: ''
													};
													editForm = {
														id: '',
														username: '',
														email: '',
														mobile: '',
														age: ''
													};
												}
											};
										}}
										class="inline"
									>
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											onclick={(e) => {
												if (!confirm('确定要删除这个用户吗？')) {
													e.preventDefault();
												}
											}}
											class="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
										>
											删除
										</button>
									</form>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if users.length === 0}
			<div class="p-8 text-center text-gray-500">
				<p>暂无用户数据</p>
			</div>
		{/if}
	</div>

	<!-- 统计信息 -->
	<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
		<div class="rounded-lg border p-4 text-center">
			<div class="text-2xl font-bold text-blue-600">{users.length}</div>
			<div class="text-sm text-gray-600">总用户数</div>
		</div>
		<div class="rounded-lg border p-4 text-center">
			<div class="text-2xl font-bold text-green-600">{systemRoles.length}</div>
			<div class="text-sm text-gray-600">系统角色</div>
		</div>
		<div class="rounded-lg border p-4 text-center">
			<div class="text-2xl font-bold text-purple-600">{organizationRoles.length}</div>
			<div class="text-sm text-gray-600">组织角色</div>
		</div>
		<div class="rounded-lg border p-4 text-center">
			<div class="text-2xl font-bold text-orange-600">{subOrganizationRoles.length}</div>
			<div class="text-sm text-gray-600">子组织角色</div>
		</div>
	</div>
</div>
