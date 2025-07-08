<script>
	import { checkUserPermission } from '$lib/server/permissions';
	import { page } from '$app/state';

	let { permission, organizationId, subOrganizationId, disabled = false, ...props } = $props();

	// 响应式状态
	let hasPermission = $state(false);
	let loading = $state(true);

	// 计算属性
	let user = $derived(page.data.user);

	// 检查权限
	async function checkPermission() {
		if (!user) {
			hasPermission = false;
			loading = false;
			return;
		}

		try {
			hasPermission = await checkUserPermission(user.id, permission, {
				organizationId,
				subOrganizationId
			});
		} catch (error) {
			console.error('权限检查失败:', error);
			hasPermission = false;
		} finally {
			loading = false;
		}
	}

	// 初始化时检查权限
	$effect(() => {
		if (user && permission) {
			checkPermission();
		}
	});
</script>

{#if !loading && hasPermission}
	<button
		{disabled}
		{...props}
		class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed {props.class || ''}"
	>
		{@render children()}
	</button>
{/if} 