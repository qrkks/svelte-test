<script>
	// 导入所有全局状态
	import { authState } from '$lib/state/global/auth.svelte.js';
	import { cartState } from '$lib/state/global/cart.svelte.js';
	import { toastState } from '$lib/state/global/toast.svelte.js';
	import { uiSettings, userPreferences } from '$lib/state/global/ui.svelte.js';
	import { sessionState } from '$lib/state/global/session.svelte.js';
	import { confirm } from '$lib/components/ui/ConfirmDialog.svelte';

	// 组件状态（通过页面实例访问）
	import { dev } from '$app/environment';

	// 如果不是开发环境，重定向
	if (!dev) {
		import('$app/navigation').then(({ goto }) => {
			goto('/');
		});
	}

	// 状态注册表
	const states = {
		用户认证: {
			key: 'auth',
			state: authState,
			color: 'bg-blue-100 border-blue-300 text-blue-800',
			description: '用户登录状态、角色权限等'
		},
		购物车: {
			key: 'cart',
			state: cartState,
			color: 'bg-green-100 border-green-300 text-green-800',
			description: '购物车商品、总价、优惠券等'
		},
		Toast通知: {
			key: 'toast',
			state: toastState,
			color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
			description: '当前显示的通知消息'
		},
		UI设置: {
			key: 'ui',
			state: uiSettings,
			color: 'bg-purple-100 border-purple-300 text-purple-800',
			description: '主题、语言、侧边栏等UI配置'
		},
		用户偏好: {
			key: 'preferences',
			state: userPreferences,
			color: 'bg-pink-100 border-pink-300 text-pink-800',
			description: '通知设置、隐私配置、默认值等'
		},
		会话状态: {
			key: 'session',
			state: sessionState,
			color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
			description: '当前页面、面包屑、未保存更改等'
		}
	};

	let expandedStates = $state({});
	let editingStates = $state({});
	let editValues = $state({});

	// 切换展开状态
	function toggleExpanded(key) {
		expandedStates[key] = !expandedStates[key];
	}

	// 开始编辑
	function startEdit(key, state) {
		editingStates[key] = true;
		editValues[key] = JSON.stringify(state.value || state, null, 2);
	}

	// 取消编辑
	function cancelEdit(key) {
		editingStates[key] = false;
		delete editValues[key];
	}

	// 保存编辑
	function saveEdit(key, stateObj) {
		try {
			const newValue = JSON.parse(editValues[key]);
			if (stateObj.value !== undefined) {
				stateObj.value = newValue;
			} else {
				Object.assign(stateObj, newValue);
			}
			editingStates[key] = false;
			delete editValues[key];
		} catch (error) {
			alert('JSON 格式错误: ' + error.message);
		}
	}

	// 重置状态
	function resetState(key, stateObj) {
		if (confirm(`确定要重置 ${key} 状态吗？`)) {
			if (stateObj.reset) {
				stateObj.reset();
			} else {
				// 对于没有 reset 方法的状态，手动重置
				console.warn(`${key} 状态没有 reset 方法`);
			}
		}
	}

	// 导出所有状态
	function exportAllStates() {
		const exported = {};
		Object.entries(states).forEach(([name, { state }]) => {
			exported[name] = state.value || state;
		});

		const dataStr = JSON.stringify(exported, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `global-states-${new Date().toISOString().slice(0, 19)}.json`;
		a.click();

		URL.revokeObjectURL(url);
	}

	async function confirmExport() {
		const result = await confirm.show({
			title: '导出所有状态',
			message: '确定要导出所有状态吗？',
			confirmText: '导出',
			cancelText: '取消',
			variant: 'danger'
		});
		if (result) {
			exportAllStates();
		}
	}

	// 刷新页面
	function refreshStates() {
		// 强制重新渲染
		expandedStates = { ...expandedStates };
	}
</script>

<svelte:head>
	<title>🔍 全局状态监控 - 开发工具</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="mx-auto max-w-6xl">
		<!-- 头部 -->
		<div class="mb-6 rounded-lg border bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900">
						🔍 全局状态监控
						<span class="rounded bg-red-100 px-2 py-1 text-sm text-red-800">开发模式</span>
					</h1>
					<p class="mt-1 text-gray-600">实时查看和调试应用中的所有全局状态</p>
				</div>

				<div class="flex gap-3">
					<button
						onclick={refreshStates}
						class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						🔄 刷新
					</button>
					<button
						onclick={confirmExport}
						class="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
					>
						📥 导出
					</button>
				</div>
			</div>
		</div>

		<!-- 状态列表 -->
		<div class="grid gap-6">
			{#each Object.entries(states) as [name, { key, state, color, description }]}
				<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
					<!-- 状态头部 -->
					<div class="border-b p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="rounded-full border px-3 py-1 text-sm font-medium {color}">
									{name}
								</span>
								<span class="text-sm text-gray-600">{description}</span>
							</div>

							<div class="flex items-center gap-2">
								<button
									onclick={() => toggleExpanded(key)}
									class="p-2 text-gray-400 transition-colors hover:text-gray-600"
									title={expandedStates[key] ? '收起' : '展开'}
								>
									{expandedStates[key] ? '📖' : '📄'}
								</button>

								{#if state.reset}
									<button
										onclick={() => resetState(name, state)}
										class="p-2 text-red-400 transition-colors hover:text-red-600"
										title="重置状态"
									>
										🗑️
									</button>
								{/if}

								<button
									onclick={() => startEdit(key, state)}
									class="p-2 text-blue-400 transition-colors hover:text-blue-600"
									title="编辑状态"
								>
									✏️
								</button>
							</div>
						</div>
					</div>

					<!-- 状态内容 -->
					<div class="p-4">
						{#if editingStates[key]}
							<!-- 编辑模式 -->
							<div class="space-y-3">
								<textarea
									bind:value={editValues[key]}
									class="h-40 w-full rounded-md border border-gray-300 p-3 font-mono text-sm"
									placeholder="编辑 JSON 格式的状态..."
								></textarea>
								<div class="flex gap-2">
									<button
										onclick={() => saveEdit(key, state)}
										class="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
									>
										💾 保存
									</button>
									<button
										onclick={() => cancelEdit(key)}
										class="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
									>
										❌ 取消
									</button>
								</div>
							</div>
						{:else}
							<!-- 查看模式 -->
							<div class="rounded-md bg-gray-50 p-3 font-mono text-sm">
								{#if expandedStates[key]}
									<pre class="whitespace-pre-wrap">{JSON.stringify(
											state.value || state,
											null,
											2
										)}</pre>
								{:else}
									<div class="text-gray-600">
										{JSON.stringify(state.value || state, null, 0).slice(0, 100)}
										{JSON.stringify(state.value || state).length > 100 ? '...' : ''}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- 底部提示 -->
		<div class="mt-8 text-center text-sm text-gray-500">
			<p>💡 提示：这个页面只在开发环境下可用</p>
			<p>🔗 访问路径：<code class="rounded bg-gray-200 px-2 py-1">/dev/states</code></p>
		</div>
	</div>
</div>

<style>
	pre {
		max-height: 300px;
		overflow: auto;
	}
</style>
