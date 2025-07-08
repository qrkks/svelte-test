<script>
	import { getUserOrganizations } from '$lib/server/permissions';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { currentOrganizationId = null, showLabel = true } = $props();

	// 响应式状态
	let organizations = $state([]);
	let loading = $state(true);
	let showDropdown = $state(false);

	// 计算属性
	let user = $derived(page.data.user);
	let currentOrganization = $derived(
		organizations.find(org => org.organizationId === currentOrganizationId)
	);

	// 加载用户组织
	async function loadOrganizations() {
		if (!user) {
			organizations = [];
			loading = false;
			return;
		}

		try {
			organizations = await getUserOrganizations(user.id);
		} catch (error) {
			console.error('加载组织失败:', error);
			organizations = [];
		} finally {
			loading = false;
		}
	}

	// 切换组织
	function switchOrganization(organizationId) {
		// 这里可以根据需要实现组织切换逻辑
		// 比如更新URL参数、重新加载页面数据等
		currentOrganizationId = organizationId;
		showDropdown = false;
		
		// 示例：更新URL参数
		const url = new URL(window.location.href);
		url.searchParams.set('org', organizationId);
		goto(url.pathname + url.search, { replaceState: true });
	}

	// 初始化
	$effect(() => {
		if (user) {
			loadOrganizations();
		}
	});

	// 切换下拉菜单
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// 点击外部关闭下拉菜单
	function handleClickOutside(event) {
		if (!event.target.closest('.organization-switcher')) {
			showDropdown = false;
		}
	}

	// 监听点击事件
	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

{#if !loading && organizations.length > 0}
	<div class="organization-switcher relative">
		{#if showLabel}
			<span class="block text-sm font-medium text-gray-700 mb-1">当前组织</span>
		{/if}
		
		<button
			type="button"
			onclick={toggleDropdown}
			class="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			<div class="flex items-center">
				<div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
				<span class="font-medium">
					{currentOrganization ? currentOrganization.organizationName : '选择组织'}
				</span>
			</div>
			<svg
				class="w-4 h-4 text-gray-400 transition-transform {showDropdown ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if showDropdown}
			<div class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
				<div class="py-1">
					{#each organizations as organization}
						<button
							type="button"
							onclick={() => switchOrganization(organization.organizationId)}
							class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {organization.organizationId === currentOrganizationId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}"
						>
							<div class="flex items-center justify-between">
								<span class="font-medium">{organization.organizationName}</span>
								<span class="text-xs text-gray-500">{organization.roleName}</span>
							</div>
							{#if organization.organizationId === currentOrganizationId}
								<div class="text-xs text-blue-600 mt-1">当前组织</div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else if loading}
	<div class="flex items-center space-x-2">
		{#if showLabel}
			<span class="block text-sm font-medium text-gray-700">当前组织</span>
		{/if}
		<div class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
		<span class="text-sm text-gray-500">加载中...</span>
	</div>
{:else}
	<div class="text-sm text-gray-500">
		{#if showLabel}
			<span>当前组织: </span>
		{/if}
		<span>无可用组织</span>
	</div>
{/if} 