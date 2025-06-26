<script>
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	
	let showConfirm = $state(false);
	
	function handleConfirm() {
		console.log('用户确认了操作');
		// 执行确认后的逻辑
	}
	
	function handleCancel() {
		console.log('用户取消了操作');
	}
</script>

<!-- 触发按钮 -->
<button onclick={() => showConfirm = true}>
	删除文件
</button>

<!-- 确认对话框 -->
<ConfirmDialog
	bind:open={showConfirm}
	title="删除确认"
	message="确定要删除这个文件吗？此操作不可撤销。"
	confirmText="删除"
	cancelText="取消"
	danger={true}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>