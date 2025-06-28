<script>
	import '../app.css';
	import { authState } from '$lib/stores/global/auth.svelte.js';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { children, data } = $props();

	// 单文件Toast引用
	let globalToastRef;

	// 一次性更新多个属性
	Object.assign(authState, { ...data.user });

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
		class="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 flex items-center justify-center text-lg"
		title="开发工具 (Ctrl+Shift+D)"
	>
		🔧
	</button>

	<!-- 开发工具面板 -->
	{#if showDevTools}
		<div class="fixed bottom-20 right-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-48">
			<h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
				🛠️ 开发工具
			</h3>
			
			<div class="space-y-2">
				<button
					onclick={openStatesMonitor}
					class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
				>
					🔍 状态监控
				</button>
				
				<div class="border-t pt-2">
					<div class="text-xs text-gray-500 px-3">
						当前路由: {$page.route.id || '/'}
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
