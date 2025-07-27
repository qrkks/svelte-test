<!-- 统一错误页面 -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	
	let { error, status, route, url } = $derived(page);
</script>

<!-- 包含 navbar 的错误页面 -->
<!-- <Navbar /> -->

<main class="error-container">
	<div class="error-content">
		<h1>😱 页面出错了</h1>
		<p class="error-message">抱歉，页面遇到了问题</p>
		
		<div class="error-details">
			<p><strong>错误状态:</strong> {status}</p>
			<p><strong>错误信息:</strong> {error?.message}</p>
			<p><strong>当前路径:</strong> {url?.pathname}</p>
		</div>
		
		<div class="error-actions">
			<button class="btn btn-primary" onclick={() => goto('/')}>
				🏠 返回首页
			</button>
			<button class="btn btn-secondary" onclick={() => history.back()}>
				⬅️ 返回上一页
			</button>
			<button class="btn btn-outline" onclick={() => window.location.reload()}>
				🔄 刷新页面
			</button>
		</div>
		
		{#if import.meta.env.DEV}
			<div class="debug-info">
				<h3>调试信息（仅开发环境）</h3>
				<details>
					<summary>查看详细错误信息</summary>
					<pre>{JSON.stringify(error, null, 2)}</pre>
				</details>
			</div>
		{/if}
	</div>
</main>

<style>
	.error-container {
		min-height: calc(100vh - 64px); /* 减去 navbar 高度 */
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.error-content {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 600px;
		width: 100%;
	}
	
	.error-content h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #333;
	}
	
	.error-message {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}
	
	.error-details {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		text-align: left;
	}
	
	.error-details p {
		margin: 0.5rem 0;
		font-family: monospace;
	}
	
	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.btn-primary {
		background: #007bff;
		color: white;
	}
	
	.btn-primary:hover {
		background: #0056b3;
	}
	
	.btn-secondary {
		background: #6c757d;
		color: white;
	}
	
	.btn-secondary:hover {
		background: #545b62;
	}
	
	.btn-outline {
		background: transparent;
		color: #007bff;
		border: 2px solid #007bff;
	}
	
	.btn-outline:hover {
		background: #007bff;
		color: white;
	}
	
	.debug-info {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #eee;
	}
	
	.debug-info h3 {
		color: #666;
		margin-bottom: 1rem;
	}
	
	.debug-info details {
		text-align: left;
	}
	
	.debug-info pre {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.9rem;
	}
</style>
