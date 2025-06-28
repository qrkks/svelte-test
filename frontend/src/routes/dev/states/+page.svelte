<script>
	// 导入所有全局状态
	import { authState } from '$lib/stores/global/auth.svelte.js';
	import { cartState } from '$lib/stores/global/cart.svelte.js';
	import { toastState } from '$lib/stores/global/toast.svelte.js';
	import { uiSettings, userPreferences } from '$lib/stores/global/ui.svelte.js';
	import { sessionState } from '$lib/stores/global/session.svelte.js';
	
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
		'用户认证': {
			key: 'auth',
			state: authState,
			color: 'bg-blue-100 border-blue-300 text-blue-800',
			description: '用户登录状态、角色权限等'
		},
		'购物车': {
			key: 'cart', 
			state: cartState,
			color: 'bg-green-100 border-green-300 text-green-800',
			description: '购物车商品、总价、优惠券等'
		},
		'Toast通知': {
			key: 'toast',
			state: toastState,
			color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
			description: '当前显示的通知消息'
		},
		'UI设置': {
			key: 'ui',
			state: uiSettings,
			color: 'bg-purple-100 border-purple-300 text-purple-800',
			description: '主题、语言、侧边栏等UI配置'
		},
		'用户偏好': {
			key: 'preferences',
			state: userPreferences,
			color: 'bg-pink-100 border-pink-300 text-pink-800',
			description: '通知设置、隐私配置、默认值等'
		},
		'会话状态': {
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
	<div class="max-w-6xl mx-auto">
		<!-- 头部 -->
		<div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
						🔍 全局状态监控
						<span class="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">开发模式</span>
					</h1>
					<p class="text-gray-600 mt-1">实时查看和调试应用中的所有全局状态</p>
				</div>
				
				<div class="flex gap-3">
					<button
						onclick={refreshStates}
						class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						🔄 刷新
					</button>
					<button
						onclick={exportAllStates}
						class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
					>
						📥 导出
					</button>
				</div>
			</div>
		</div>

		<!-- 状态列表 -->
		<div class="grid gap-6">
			{#each Object.entries(states) as [name, { key, state, color, description }]}
				<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
					<!-- 状态头部 -->
					<div class="p-4 border-b">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="px-3 py-1 rounded-full text-sm font-medium border {color}">
									{name}
								</span>
								<span class="text-gray-600 text-sm">{description}</span>
							</div>
							
							<div class="flex items-center gap-2">
								<button
									onclick={() => toggleExpanded(key)}
									class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
									title={expandedStates[key] ? '收起' : '展开'}
								>
									{expandedStates[key] ? '📖' : '📄'}
								</button>
								
								{#if state.reset}
									<button
										onclick={() => resetState(name, state)}
										class="p-2 text-red-400 hover:text-red-600 transition-colors"
										title="重置状态"
									>
										🗑️
									</button>
								{/if}
								
								<button
									onclick={() => startEdit(key, state)}
									class="p-2 text-blue-400 hover:text-blue-600 transition-colors"
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
									class="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
									placeholder="编辑 JSON 格式的状态..."
								></textarea>
								<div class="flex gap-2">
									<button
										onclick={() => saveEdit(key, state)}
										class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
									>
										💾 保存
									</button>
									<button
										onclick={() => cancelEdit(key)}
										class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
									>
										❌ 取消
									</button>
								</div>
							</div>
						{:else}
							<!-- 查看模式 -->
							<div class="bg-gray-50 rounded-md p-3 font-mono text-sm">
								{#if expandedStates[key]}
									<pre class="whitespace-pre-wrap">{JSON.stringify(state.value || state, null, 2)}</pre>
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
		<div class="mt-8 text-center text-gray-500 text-sm">
			<p>💡 提示：这个页面只在开发环境下可用</p>
			<p>🔗 访问路径：<code class="bg-gray-200 px-2 py-1 rounded">/dev/states</code></p>
		</div>
	</div>
</div>

<style>
	pre {
		max-height: 300px;
		overflow: auto;
	}
</style> 