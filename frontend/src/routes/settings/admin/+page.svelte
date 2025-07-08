<script>
	let { data } = $props();
	let stats = data.stats;
</script>

<svelte:head>
	<title>系统管理 - 系统设置</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">系统管理</h1>
		<p>管理系统用户、组织、角色和权限</p>
	</div>

	{#if !stats}
		<div class="flex h-64 items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
		</div>
	{:else}
		<!-- 统计卡片 -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-blue-100 p-2">
						<svg
							class="h-6 w-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">用户总数</p>
						<p class="text-2xl font-bold text-gray-900">{stats.users}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-green-100 p-2">
						<svg
							class="h-6 w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">主组织</p>
						<p class="text-2xl font-bold text-gray-900">{stats.organizations}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-purple-100 p-2">
						<svg
							class="h-6 w-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">子组织</p>
						<p class="text-2xl font-bold text-gray-900">{stats.subOrganizations}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-yellow-100 p-2">
						<svg
							class="h-6 w-6 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">系统角色</p>
						<p class="text-2xl font-bold text-gray-900">{stats.systemRoles}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-indigo-100 p-2">
						<svg
							class="h-6 w-6 text-indigo-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">组织角色</p>
						<p class="text-2xl font-bold text-gray-900">{stats.organizationRoles}</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg border p-6 shadow-sm">
				<div class="flex items-center">
					<div class="rounded-lg bg-pink-100 p-2">
						<svg
							class="h-6 w-6 text-pink-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">子组织角色</p>
						<p class="text-2xl font-bold text-gray-900">{stats.subOrganizationRoles}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 管理功能卡片 -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<!-- 用户角色管理 -->
			<a href="/settings/admin/user-roles" class="block">
				<div class="rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
					<div class="mb-4 flex items-center">
						<div class="rounded-lg bg-blue-100 p-2">
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<h3 class="ml-3 text-lg font-semibold">用户角色管理</h3>
					</div>
					<p class="text-gray-600">为用户分配系统角色、组织角色和子组织角色</p>
				</div>
			</a>

			<!-- 角色权限分配 -->
			<a href="/settings/admin/role-permissions" class="block">
				<div class="rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
					<div class="mb-4 flex items-center">
						<div class="rounded-lg bg-green-100 p-2">
							<svg
								class="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<h3 class="ml-3 text-lg font-semibold">角色权限分配</h3>
					</div>
					<p class="text-gray-600">为角色分配具体的权限和功能访问权限</p>
				</div>
			</a>

			<!-- 用户管理 -->
			<a href="/settings/admin/users" class="block">
				<div class="rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
					<div class="mb-4 flex items-center">
						<div class="rounded-lg bg-blue-100 p-2">
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
								/>
							</svg>
						</div>
						<h3 class="ml-3 text-lg font-semibold">用户管理</h3>
					</div>
					<p class="text-gray-600">管理用户账户、状态和信息</p>
				</div>
			</a>

			<!-- 组织管理 -->
			<div class="rounded-lg border p-6 opacity-50 shadow-sm">
				<div class="mb-4 flex items-center">
					<div class="rounded-lg bg-gray-100 p-2">
						<svg
							class="h-6 w-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-400">组织管理</h3>
				</div>
				<p class="text-gray-400">管理主组织和子组织</p>
				<div class="mt-2">
					<span
						class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
					>
						开发中
					</span>
				</div>
			</div>

			<!-- 角色管理 -->
			<a href="/settings/admin/roles" class="block">
				<div class="rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
					<div class="mb-4 flex items-center">
						<div class="rounded-lg bg-yellow-100 p-2">
							<svg
								class="h-6 w-6 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h3 class="ml-3 text-lg font-semibold text-yellow-700">角色管理</h3>
					</div>
					<p class="text-gray-700">创建和管理系统角色、组织角色</p>
				</div>
			</a>

			<!-- 权限测试 -->
			<div class="rounded-lg border p-6 opacity-50 shadow-sm">
				<div class="mb-4 flex items-center">
					<div class="rounded-lg bg-gray-100 p-2">
						<svg
							class="h-6 w-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-400">权限测试</h3>
				</div>
				<p class="text-gray-400">测试权限验证和调试权限问题</p>
				<div class="mt-2">
					<span
						class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
					>
						开发中
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>
