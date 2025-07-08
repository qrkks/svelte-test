<script>
	import { enhance } from '$app/forms';
	import { Toast } from '$lib/components/ui/Toast.svelte';

	let { data, form } = $props();

	// 响应式状态
	let testForm = $state({
		userId: data.user?.id || '',
		permission: '',
		organizationId: '',
		subOrganizationId: ''
	});

	let testResult = $state(null);
	let toastMessage = $state('');
	let toastType = $state('success');

	// 计算属性
	let user = $derived(data.user);
	let userPermissions = $derived(data.userPermissions);
	let users = $derived(data.users || []);
	let organizations = $derived(data.organizations || []);
	let subOrganizations = $derived(data.subOrganizations || []);
	let permissions = $derived(data.permissions || []);

	// 方法
	function showToast(message, type = 'success') {
		toastMessage = message;
		toastType = type;
	}

	// 监听表单结果
	$effect(() => {
		if (form?.success !== undefined) {
			if (form.success) {
				testResult = form;
				showToast('权限测试完成', 'success');
			} else {
				showToast(form.error || '测试失败', 'error');
			}
		}
	});

	// 格式化权限显示
	function formatPermissions(permissions) {
		if (!permissions) return '无权限';
		
		const allPermissions = [
			...permissions.system,
			...permissions.organizations.flatMap(org => org.permissions),
			...permissions.organizations.flatMap(org => 
				org.subOrganizations.flatMap(subOrg => subOrg.permissions)
			)
		];
		
		return allPermissions.length > 0 ? allPermissions.join(', ') : '无权限';
	}

	// 获取组织名称
	function getOrganizationName(id) {
		const org = organizations.find(o => o.id === id);
		return org ? org.name : `组织${id}`;
	}

	// 获取子组织名称
	function getSubOrganizationName(id) {
		const subOrg = subOrganizations.find(so => so.id === id);
		return subOrg ? subOrg.name : `子组织${id}`;
	}
</script>

<svelte:head>
	<title>权限测试 - 系统设置</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">权限测试</h1>
		<p class="text-gray-600">测试和调试权限验证系统</p>
	</div>

	{#if !user}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="text-red-800">请先登录以使用权限测试功能</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- 权限测试表单 -->
			<div class="rounded-lg border p-6">
				<h2 class="mb-4 text-xl font-semibold">权限测试</h2>
				<form method="POST" action="?/testPermission" use:enhance>
					<div class="mb-4">
						<label for="userId" class="block text-sm font-medium text-gray-700">用户</label>
						<select
							id="userId"
							name="userId"
							bind:value={testForm.userId}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						>
							<option value="">选择用户</option>
							{#each users as user}
								<option value={user.id}>{user.username} ({user.id})</option>
							{/each}
						</select>
					</div>

					<div class="mb-4">
						<label for="permission" class="block text-sm font-medium text-gray-700">权限</label>
						<select
							id="permission"
							name="permission"
							bind:value={testForm.permission}
							required
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						>
							<option value="">选择权限</option>
							{#each permissions as permission}
								<option value={permission}>{permission}</option>
							{/each}
						</select>
					</div>

					<div class="mb-4">
						<label for="organizationId" class="block text-sm font-medium text-gray-700">主组织 (可选)</label>
						<select
							id="organizationId"
							name="organizationId"
							bind:value={testForm.organizationId}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						>
							<option value="">选择主组织</option>
							{#each organizations as org}
								<option value={org.id}>{org.name}</option>
							{/each}
						</select>
					</div>

					<div class="mb-6">
						<label for="subOrganizationId" class="block text-sm font-medium text-gray-700">子组织 (可选)</label>
						<select
							id="subOrganizationId"
							name="subOrganizationId"
							bind:value={testForm.subOrganizationId}
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						>
							<option value="">选择子组织</option>
							{#each subOrganizations as subOrg}
								<option value={subOrg.id}>{subOrg.name} (属于 {getOrganizationName(subOrg.organizationId)})</option>
							{/each}
						</select>
					</div>

					<button
						type="submit"
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						测试权限
					</button>
				</form>

				<!-- 测试结果 -->
				{#if testResult}
					<div class="mt-6 rounded-lg border p-4">
						<h3 class="mb-2 font-semibold">测试结果</h3>
						<div class="space-y-2 text-sm">
							<div>
								<span class="font-medium">用户ID:</span> {testResult.context.userId}
							</div>
							<div>
								<span class="font-medium">权限:</span> {testResult.context.permission}
							</div>
							{#if testResult.context.organizationId}
								<div>
									<span class="font-medium">主组织:</span> {getOrganizationName(testResult.context.organizationId)}
								</div>
							{/if}
							{#if testResult.context.subOrganizationId}
								<div>
									<span class="font-medium">子组织:</span> {getSubOrganizationName(testResult.context.subOrganizationId)}
								</div>
							{/if}
							<div class="mt-3">
								<span class="font-medium">结果:</span>
								<span class="ml-2 rounded-full px-2 py-1 text-xs font-medium {testResult.result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{testResult.result ? '有权限' : '无权限'}
								</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- 当前用户权限信息 -->
			<div class="rounded-lg border p-6">
				<h2 class="mb-4 text-xl font-semibold">当前用户权限</h2>
				<div class="space-y-4">
					<div>
						<span class="font-medium">用户:</span> {user.username} (ID: {user.id})
					</div>
					
					<div>
						<span class="font-medium">系统权限:</span>
						<div class="mt-1 text-sm text-gray-600">
							{userPermissions?.system?.length > 0 ? userPermissions.system.join(', ') : '无'}
						</div>
					</div>

					{#if userPermissions?.organizations?.length > 0}
						<div>
							<span class="font-medium">组织权限:</span>
							<div class="mt-2 space-y-3">
								{#each userPermissions.organizations as org}
									<div class="rounded border p-3">
										<div class="font-medium text-blue-600">{org.organizationName}</div>
										<div class="text-sm text-gray-600">
											<span class="font-medium">角色:</span> {org.roleName}
										</div>
										<div class="text-sm text-gray-600">
											<span class="font-medium">权限:</span> {org.permissions.length > 0 ? org.permissions.join(', ') : '无'}
										</div>
										
										{#if org.subOrganizations?.length > 0}
											<div class="mt-2">
												<span class="text-sm font-medium text-gray-600">子组织:</span>
												<div class="ml-4 space-y-2">
													{#each org.subOrganizations as subOrg}
														<div class="rounded border-l-2 border-gray-200 pl-3">
															<div class="text-sm font-medium">{subOrg.subOrganizationName}</div>
															<div class="text-xs text-gray-600">
																<span class="font-medium">角色:</span> {subOrg.roleName}
															</div>
															<div class="text-xs text-gray-600">
																<span class="font-medium">权限:</span> {subOrg.permissions.length > 0 ? subOrg.permissions.join(', ') : '无'}
															</div>
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{:else}
						<div>
							<span class="font-medium">组织权限:</span>
							<div class="mt-1 text-sm text-gray-600">无</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Toast 提示 -->
{#if toastMessage}
	<Toast message={toastMessage} type={toastType} on:close={() => toastMessage = ''} />
{/if} 