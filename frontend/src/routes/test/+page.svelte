<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let { data, form } = $props();
	let pageRenderTime = null;
	let pageRenderStartTime = null;
	
	// 在组件初始化时记录开始时间
	if (browser) {
		pageRenderStartTime = performance.now();
		console.log('页面渲染开始时间:', new Date().toISOString());
	}
	
	onMount(() => {
		if (browser) {
			pageRenderTime = performance.now();
			const renderDuration = pageRenderTime - pageRenderStartTime;
			console.log('页面渲染完成时间:', new Date().toISOString());
			console.log('页面渲染耗时:', renderDuration.toFixed(2), 'ms');
		}
	});
</script>

<h1>{data.title}</h1>

<!-- 用户信息和权限状态 -->
<div style="background: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #4caf50;">
	<h3>🔐 用户信息和权限</h3>
	<p><strong>用户名：</strong>{data.user.username}</p>
	<p><strong>用户ID：</strong>{data.user.id}</p>
	<p><strong>权限级别：</strong>
		{#if data.user.username === 'admin'}
			<span style="color: #e74c3c; font-weight: bold;">👑 管理员</span>
		{:else}
			<span style="color: #3498db; font-weight: bold;">👤 普通用户</span>
		{/if}
	</p>
	<p><strong>访问状态：</strong><span style="color: #27ae60; font-weight: bold;">✅ 已通过路由守卫</span></p>
</div>

<!-- 时间对比信息 -->
<div style="background: #e8f4f8; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2196f3;">
	<h3>⏱️ 时间对比分析</h3>
	
	<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
		<div style="background: #f0f8ff; padding: 10px; border-radius: 4px;">
			<h4>🔄 Load 函数执行</h4>
			<p><strong>开始时间：</strong>{data.loadStartTime}</p>
			<p><strong>结束时间：</strong>{data.loadEndTime}</p>
			<p><strong>执行耗时：</strong><span style="color: #e74c3c; font-weight: bold;">{data.loadDuration}ms</span></p>
		</div>
		
		<div style="background: #fff8f0; padding: 10px; border-radius: 4px;">
			<h4>🎨 页面渲染</h4>
			<p><strong>Load 完成时间：</strong>{data.loadEndTime}</p>
			<p><strong>页面渲染开始：</strong>{browser ? new Date().toISOString() : '服务器端渲染'}</p>
			<p><strong>页面渲染完成：</strong>
				{#if browser && pageRenderTime}
					{new Date().toISOString()}
				{:else if browser}
					<span style="color: #f39c12;">计算中...</span>
				{:else}
					<span style="color: #95a5a6;">服务器端渲染</span>
				{/if}
			</p>
			<p><strong>渲染耗时：</strong>
				{#if browser && pageRenderTime}
					<span style="color: #27ae60; font-weight: bold;">{(pageRenderTime - pageRenderStartTime).toFixed(2)}ms</span>
				{:else if browser}
					<span style="color: #f39c12;">计算中...</span>
				{:else}
					<span style="color: #95a5a6;">服务器端渲染</span>
				{/if}
			</p>
		</div>
	</div>
	
	<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
		<h4>📊 总结</h4>
		<p><strong>总耗时：</strong>
			{#if browser && pageRenderTime}
				<span style="color: #8e44ad; font-weight: bold;">{(pageRenderTime - pageRenderStartTime + data.loadDuration).toFixed(2)}ms</span>
			{:else if browser}
				<span style="color: #f39c12;">计算中...</span>
			{:else}
				<span style="color: #95a5a6;">服务器端渲染</span>
			{/if}
		</p>
		<p><strong>Load 占比：</strong>
			{#if browser && pageRenderTime}
				<span style="color: #e74c3c; font-weight: bold;">{Math.round((data.loadDuration / (pageRenderTime - pageRenderStartTime + data.loadDuration)) * 100)}%</span>
			{:else if browser}
				<span style="color: #f39c12;">计算中...</span>
			{:else}
				<span style="color: #95a5a6;">服务器端渲染</span>
			{/if}
		</p>
		<p><strong>渲染环境：</strong>
			<span style="color: {browser ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
				{browser ? '🌐 客户端渲染' : '🖥️ 服务器端渲染'}
			</span>
		</p>
	</div>
</div>

<!-- 显示 GET 请求的数据 (data) -->
<div style="background: #f0f8ff; padding: 10px; margin: 10px 0; border-radius: 4px;">
	<h3>页面加载数据 (data):</h3>
	<p><strong>当前时间：</strong>{data.currentTime}</p>
	<p><strong>Node版本：</strong>{data.serverInfo.nodeVersion}</p>
	<p><strong>环境：</strong>{data.serverInfo.environment}</p>
	<p><strong>已保存的数据数量：</strong>{data.testData.length}</p>
	
	{#if data.testData.length > 0}
		<h4>已保存的数据：</h4>
		<ul>
			{#each data.testData as item}
				<li>
					ID: {item.id} - 内容: {item.testInput}
					{#if data.user.username === 'admin'}
						<form method="post" action="?/delete" use:enhance style="display: inline;">
							<input type="hidden" name="id" value={item.id} />
							<button
								type="submit"
								style="margin-left: 10px; background: #ff4444; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;"
								>删除</button
							>
						</form>
					{:else}
						<span style="margin-left: 10px; color: #95a5a6; font-size: 12px;">(需要管理员权限)</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<!-- 显示 POST 请求的数据 (form) -->
{#if form}
	<div style="background: #fff0f0; padding: 10px; margin: 10px 0; border-radius: 4px;">
		<h3>表单提交结果 (form):</h3>
		<pre>{JSON.stringify(form, null, 2)}</pre>
	</div>
{/if}

<!-- 提交表单 -->
<div style="background: #f0fff0; padding: 10px; margin: 10px 0; border-radius: 4px;">
	<h3>提交新数据:</h3>
	<form method="post" action="?/submit" use:enhance>
		<input type="text" name="testInput" placeholder="输入内容..." />
		<button type="submit">提交</button>
	</form>
</div>

<!-- 清空所有数据 -->
<div style="background: #fff8f0; padding: 10px; margin: 10px 0; border-radius: 4px;">
	<h3>清空所有数据:</h3>
	{#if data.user.username === 'admin'}
		<form method="post" action="?/clear" use:enhance>
			<button
				type="submit"
				style="background: #ff8800; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;"
				>清空所有数据</button
			>
		</form>
	{:else}
		<p style="color: #e74c3c;">❌ 权限不足，只有管理员可以清空所有数据</p>
	{/if}
</div>

<!-- 调试信息 -->
<details>
	<summary>调试信息</summary>
	<pre>data: {JSON.stringify(data, null, 2)}</pre>
	<pre>form: {JSON.stringify(form, null, 2)}</pre>
	<pre>browser: {browser}</pre>
	<pre>pageRenderStartTime: {pageRenderStartTime}</pre>
	<pre>pageRenderTime: {pageRenderTime}</pre>
</details>
