<!-- ConfirmModal.svelte -->
<script>
	let message = '确认执行此操作？';
	let modal = $state(false);
	let onConfirm = () => {
		modal = false;
		console.log('确认');
	};
	let onCancel = () => {
		modal = false;
		console.log('取消');
	};
</script>

<button onclick={() => (modal = true)}>打开模态框</button>
{#if modal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="w-full max-w-sm rounded-lg bg-white p-6">
			<p class="mb-4 text-gray-700">{message}</p>
			<div class="flex justify-end gap-2">
				<button class="btn" onclick={onCancel}>取消</button>
				<button class="btn btn-danger" onclick={onConfirm}>确认</button>
			</div>
		</div>
	</div>
{/if}
