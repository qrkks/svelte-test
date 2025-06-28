<script module>
	import { fly, fade } from 'svelte/transition';
	
	// 全局状态管理
	let dialogState = $state({
		isOpen: false,
		title: '',
		message: '',
		confirmText: '确认',
		cancelText: '取消',
		variant: 'default' // 'default', 'danger', 'save'
	});

	let resolvePromise = null;

	// 显示确认对话框的核心函数
	function showConfirm({
		message = '您确定要继续吗？',
		title = '确认',
		confirmText = '确认',
		cancelText = '取消',
		variant = 'default'
	} = {}) {
		// 如果有旧的 Promise 未处理，先取消它
		if (resolvePromise) {
			resolvePromise(false);
		}

		// 更新状态
		dialogState.isOpen = true;
		dialogState.title = title;
		dialogState.message = message;
		dialogState.confirmText = confirmText;
		dialogState.cancelText = cancelText;
		dialogState.variant = variant;

		// 返回 Promise
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	}

	// 隐藏对话框的内部函数
	function hideConfirm() {
		dialogState.isOpen = false;
		if (resolvePromise) {
			resolvePromise(false);
			resolvePromise = null;
		}
	}

	// 导出的 API
	export const confirm = {
		// 基础方法
		show: showConfirm,
		hide: hideConfirm,
		
		// 便捷方法
		delete: (message = '您确定要删除这个项目吗？这个操作无法撤销。', title = '确认删除') =>
			showConfirm({
				message,
				title,
				confirmText: '删除',
				cancelText: '取消',
				variant: 'danger'
			}),
		
		save: (message = '您确定要保存更改吗？', title = '保存更改') =>
			showConfirm({
				message,
				title,
				confirmText: '保存',
				cancelText: '取消',
				variant: 'save'
			}),
		
		danger: (message = '您确定要执行这个危险操作吗？', title = '危险操作') =>
			showConfirm({
				message,
				title,
				confirmText: '继续',
				cancelText: '取消',
				variant: 'danger'
			})
	};
</script>

<script>
	// 确认操作 - 组件实例级函数
	function handleConfirm() {
		dialogState.isOpen = false;
		if (resolvePromise) {
			resolvePromise(true);
			resolvePromise = null;
		}
	}

	// 取消操作 - 组件实例级函数
	function handleCancel() {
		dialogState.isOpen = false;
		if (resolvePromise) {
			resolvePromise(false);
			resolvePromise = null;
		}
	}

	// 键盘事件处理
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			handleCancel();
		} else if (event.key === 'Enter') {
			handleConfirm();
		}
	}

	// 背景点击处理
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}

	// 获取确认按钮样式
	function getConfirmButtonClass() {
		if (dialogState.variant === 'danger') {
			return 'bg-red-600 hover:bg-red-700 text-white';
		} else if (dialogState.variant === 'save') {
			return 'bg-green-600 hover:bg-green-700 text-white';
		}
		return 'bg-blue-600 hover:bg-blue-700 text-white';
	}

	// 处理窗口键盘事件
	function handleWindowKeydown(event) {
		if (dialogState.isOpen) {
			handleKeydown(event);
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<!-- 对话框模态 -->
{#if dialogState.isOpen}
	<!-- 遮罩层 -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
		onclick={handleBackdropClick}
		role="presentation"
		aria-label="对话框遮罩"
		transition:fade={{ duration: 200 }}
	>
		<!-- 对话框 -->
		<div
			class="relative w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800"
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
			<div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
				<h3 id="confirm-dialog-title" class="text-lg font-semibold text-gray-900 dark:text-white">
					{dialogState.title}
				</h3>
			</div>

			<!-- 内容区域 -->
			<div class="p-6">
				<div class="flex items-start">
					<!-- 图标 -->
					<div class="mx-auto flex-shrink-0">
						{#if dialogState.variant === 'danger'}
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
								<svg
									class="h-6 w-6 text-red-600 dark:text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
									></path>
								</svg>
							</div>
						{:else if dialogState.variant === 'save'}
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
								<svg
									class="h-6 w-6 text-green-600 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
						{:else}
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
								<svg
									class="h-6 w-6 text-blue-600 dark:text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<!-- 消息文本 -->
				<div class="mt-4 text-center">
					<p id="confirm-dialog-message" class="text-gray-700 dark:text-gray-300">
						{dialogState.message}
					</p>
				</div>
			</div>

			<!-- 底部按钮 -->
			<div class="flex gap-3 rounded-b-lg bg-gray-50 px-6 py-4 dark:bg-gray-700/50">
				<button
					class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
					onclick={handleCancel}
				>
					{dialogState.cancelText}
				</button>

				<button
					class="flex-1 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {getConfirmButtonClass()}"
					onclick={handleConfirm}
				>
					{dialogState.confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
