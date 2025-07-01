<script>
	import '../app.css';
	import { authState } from '$lib/state/global/auth.svelte.js';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { children, data, form } = $props();

	// 🔧 修复：使用响应式更新用户状态
	$effect(() => {
		if (data.user) {
			// 用户已登录，更新认证状态
			Object.assign(authState, {
				id: data.user.id,
				username: data.user.username,
				role: data.user.role || 'user',
				lastLoginTime: data.user.lastLoginTime || null
			});
		} else {
			// 用户未登录，清空认证状态
			Object.assign(authState, {
				id: null,
				username: '',
				role: 'user',
				lastLoginTime: null
			});
		}
		// DEBUG: 在开发时监控关键数据，注意生产前删除
		$inspect('layout: data', data);
		$inspect('layout: form', form);
		$inspect('layout: page', page);
		$inspect('layout: page.data === data', page.data === data);
		$inspect('layout: page.form === form', page.form === form);
	});

	// 开发工具状态
	let showDevTools = $state(false);

	// 开发工具功能
	function toggleDevTools() {
		showDevTools = !showDevTools;
	}

	function openStatesMonitor() {
		goto('/dev/states');
		showDevTools = false;
	}

	// 快捷键支持 (Ctrl+Shift+D)
	function handleGlobalKeydown(event) {
		if (dev && event.ctrlKey && event.shiftKey && event.key === 'D') {
			event.preventDefault();
			toggleDevTools();
		}
	}

	// $effect(() => {
	// 	$inspect(authState);
	// 	$inspect({...data.user});
	// 	console.log(crypto.randomUUID());
	// });
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<!-- 导航栏 -->
<Navbar />

<!-- 主内容区域 -->
<main class="min-h-screen bg-gray-50 dark:bg-gray-900">
	{@render children()}
</main>

<!-- Toast 组件 -->
<Toast />

<!-- ConfirmDialog 组件 -->
<ConfirmDialog />

<!-- 开发工具 (仅开发环境) -->
{#if dev}
	<!-- 浮动开发工具按钮 -->
	<button
		onclick={toggleDevTools}
		class="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-lg text-white shadow-lg transition-all duration-200 hover:bg-gray-700"
		title="开发工具 (Ctrl+Shift+D)"
	>
		🔧
	</button>

	<!-- 开发工具面板 -->
	{#if showDevTools}
		<div
			class="fixed bottom-20 right-6 z-50 min-w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
		>
			<h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-900">🛠️ 开发工具</h3>

			<div class="space-y-2">
				<button
					onclick={openStatesMonitor}
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					🔍 状态监控
				</button>

				<div class="border-t pt-2">
					<div class="px-3 text-xs text-gray-500">
						当前路由: {$page.route.id || '/'}
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
