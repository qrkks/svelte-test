<script>
	import { toastState, removeToast } from '$lib/stores/global/toast.svelte.js';
	import { fly } from 'svelte/transition';
	
	// 获取图标
	function getIcon(type) {
		switch (type) {
			case 'success': return '✅';
			case 'error': return '❌';
			case 'warning': return '⚠️';
			case 'info': 
			default: return 'ℹ️';
		}
	}
	
	// 获取样式类
	function getTypeClass(type) {
		switch (type) {
			case 'success': return 'bg-green-100 border-green-500 text-green-800';
			case 'error': return 'bg-red-100 border-red-500 text-red-800';
			case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
			case 'info':
			default: return 'bg-blue-100 border-blue-500 text-blue-800';
		}
	}
</script>

<!-- Toast 容器 -->
<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each toastState.items as item (item.id)}
		<div 
			class="flex items-center p-4 rounded-lg border-l-4 shadow-lg max-w-sm {getTypeClass(item.type)}"
			transition:fly={{ x: 300, duration: 200 }}
		>
			<!-- 图标 -->
			<span class="text-lg mr-3">
				{getIcon(item.type)}
			</span>
			
			<!-- 消息内容 -->
			<div class="flex-1">
				<p class="font-medium">{item.message}</p>
			</div>
			
			<!-- 关闭按钮 -->
			<button 
				class="ml-3 text-gray-500 hover:text-gray-700"
				onclick={() => removeToast(item.id)}
				aria-label="Close"
			>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
	{/each}
</div> 