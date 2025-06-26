<script>
	import { onMount, onDestroy } from 'svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	onMount(() => {
		if (import.meta.env.DEV) {
			toast.success('页面的初始化操作', 500);
		}
	});

	onDestroy(() => {
		toast.info('页面销毁', 500);
	});
</script>

<div class="p-8 max-w-lg mx-auto">
	<h1 class="h1 mb-6">Toast 测试页面</h1>
	
	<div class="space-y-4">
		<button 
			class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
			onclick={() => toast.success('操作成功！')}
		>
			成功消息
		</button>
		
		<button 
			class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
			onclick={() => toast.error('操作失败，请重试')}
		>
			错误消息
		</button>
		
		<button 
			class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
			onclick={() => toast.warning('请注意检查输入')}
		>
			警告消息
		</button>
		
		<button 
			class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			onclick={() => toast.info('这是一条提示信息')}
		>
			信息消息
		</button>
		
		<button 
			class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
			onclick={() => toast.success('这是一条长时间显示的消息', 10000)}
		>
			长时间显示 (10秒)
		</button>
		
		<button 
			class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
			onclick={() => toast.clear()}
		>
			清空所有
		</button>
	</div>
</div> 