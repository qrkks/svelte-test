<!-- ToastComplete.svelte - 完整Toast解决方案 -->
<!-- 
使用方法：
1. 复制这个文件到目标项目
2. 在layout中添加 <ToastComplete />
3. 直接调用 toast.success('消息')

无需额外依赖！
-->
<script module>
	// 全局状态和方法，但都在这一个文件里
	let toasts = $state([]);
	let idCounter = $state(0);
	
	function addToast(message, type = 'info', duration = 3000) {
		const id = idCounter++;
		const toast = {
			id,
			message,
			type,
			duration,
			visible: true
		};
		
		toasts.push(toast);
		
		// 自动移除
		if (duration > 0) {
			setTimeout(() => {
				hideToast(id);
			}, duration);
		}
		
		return id;
	}
	
	function hideToast(id) {
		const index = toasts.findIndex(t => t.id === id);
		if (index > -1) {
			toasts[index].visible = false;
			// 动画结束后移除
			setTimeout(() => {
				const removeIndex = toasts.findIndex(t => t.id === id);
				if (removeIndex > -1) {
					toasts.splice(removeIndex, 1);
				}
			}, 300);
		}
	}
	
	function clearToasts() {
		toasts.forEach(toast => {
			toast.visible = false;
		});
		setTimeout(() => {
			toasts.length = 0;
		}, 300);
	}
	
	// 导出的全局API
	export const toast = {
		show: addToast,
		hide: hideToast,
		clear: clearToasts,
		success: (message, duration = 3000) => addToast(message, 'success', duration),
		error: (message, duration = 5000) => addToast(message, 'error', duration),
		warning: (message, duration = 4000) => addToast(message, 'warning', duration),
		info: (message, duration = 3000) => addToast(message, 'info', duration),
		
		// 工具函数
		utils: {
			getCount: () => toasts.length,
			getToasts: () => toasts,
			hasToasts: () => toasts.length > 0
		}
	};
</script>

<script>
	// 组件脚本（可以为空，状态在module中管理）
</script>

<!-- Toast容器 -->
<div class="toast-container">
	{#each toasts as toastItem (toastItem.id)}
		<div 
			class="toast toast-{toastItem.type}"
			class:visible={toastItem.visible}
			role="alert"
			aria-live="polite"
		>
			<div class="toast-content">
				<span class="toast-icon">
					{#if toastItem.type === 'success'}
						✓
					{:else if toastItem.type === 'error'}
						✕
					{:else if toastItem.type === 'warning'}
						⚠
					{:else}
						ℹ
					{/if}
				</span>
				<span class="toast-message">{toastItem.message}</span>
				<button 
					class="toast-close"
					onclick={() => hideToast(toastItem.id)}
					aria-label="关闭通知"
				>
					×
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 10px;
		pointer-events: none;
	}
	
	.toast {
		min-width: 300px;
		max-width: 500px;
		padding: 0;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateX(100%);
		opacity: 0;
		transition: all 0.3s ease-in-out;
		pointer-events: auto;
		overflow: hidden;
	}
	
	.toast.visible {
		transform: translateX(0);
		opacity: 1;
	}
	
	.toast-content {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		gap: 12px;
	}
	
	.toast-icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 16px;
	}
	
	.toast-message {
		flex: 1;
		font-size: 14px;
		line-height: 1.4;
	}
	
	.toast-close {
		flex-shrink: 0;
		background: none;
		border: none;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		padding: 0;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}
	
	.toast-close:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
	
	/* 不同类型的样式 */
	.toast-success {
		background: #10b981;
		color: white;
	}
	
	.toast-error {
		background: #ef4444;
		color: white;
	}
	
	.toast-warning {
		background: #f59e0b;
		color: white;
	}
	
	.toast-info {
		background: #3b82f6;
		color: white;
	}
	
	/* 响应式 */
	@media (max-width: 640px) {
		.toast-container {
			top: 10px;
			right: 10px;
			left: 10px;
		}
		
		.toast {
			min-width: auto;
			max-width: none;
		}
	}
</style> 