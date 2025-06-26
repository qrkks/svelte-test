<script>
	import { fly, fade } from 'svelte/transition';
	
	let {
		// 控制显示状态
		open = $bindable(false),
		// 标题
		title = '确认操作',
		// 消息内容
		message = '你确定要执行此操作吗？',
		// 确认按钮文本
		confirmText = '确认',
		// 取消按钮文本  
		cancelText = '取消',
		// 危险操作样式
		danger = false,
		// 是否显示关闭按钮
		showCloseButton = true,
		// 点击遮罩层是否关闭
		closeOnBackdrop = true,
		// ESC键是否关闭
		closeOnEscape = true,
		// 回调函数
		onConfirm,
		onCancel,
		onClose
	} = $props();
	
	// 处理确认
	function handleConfirm() {
		onConfirm?.();
		open = false;
	}
	
	// 处理取消
	function handleCancel() {
		onCancel?.();
		open = false;
	}
	
	// 处理关闭
	function handleClose() {
		onClose?.();
		open = false;
	}
	
	// 处理遮罩层点击
	function handleBackdropClick(event) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			handleClose();
		}
	}
	
	// 处理键盘事件
	function handleKeydown(event) {
		if (event.key === 'Escape' && closeOnEscape) {
			handleClose();
		}
		
		// Enter键确认操作
		if (event.key === 'Enter') {
			event.preventDefault();
			handleConfirm();
		}
	}
	
	// 获取确认按钮样式
	function getConfirmButtonClass() {
		if (danger) {
			return 'bg-red-600 hover:bg-red-700 text-white';
		}
		return 'bg-blue-600 hover:bg-blue-700 text-white';
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- 遮罩层 -->
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && handleBackdropClick(e)}
		role="presentation"
		aria-label="对话框遮罩"
		transition:fade={{ duration: 200 }}
	>
		<!-- 对话框 -->
		<div 
			class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-message"
			transition:fly={{ y: -20, duration: 200 }}
		>
			<!-- 头部 -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<h3 id="confirm-dialog-title" class="text-lg font-semibold text-gray-900 dark:text-white">
					{title}
				</h3>
				
				{#if showCloseButton}
					<button
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						onclick={handleClose}
						aria-label="关闭"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
						</svg>
					</button>
				{/if}
			</div>
			
			<!-- 内容区域 -->
			<div class="p-6">
				<div class="flex items-start">
					<!-- 图标 -->
					<div class="flex-shrink-0 mx-auto">
						{#if danger}
							<div class="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
								<svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
							</div>
						{:else}
							<div class="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
								<svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
						{/if}
					</div>
				</div>
				
				<!-- 消息文本 -->
				<div class="mt-4 text-center">
					<p id="confirm-dialog-message" class="text-gray-700 dark:text-gray-300">
						{message}
					</p>
				</div>
			</div>
			
			<!-- 底部按钮 -->
			<div class="flex gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
				<button
					class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					onclick={handleCancel}
				>
					{cancelText}
				</button>
				
				<button
					class="flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 {getConfirmButtonClass()}"
					onclick={handleConfirm}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if} 