<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { data, form } = $props();

	// 删除确认函数
	function confirmDelete(item) {
		return confirm(`确定要删除这条数据吗？\n内容：${item.testInput}`);
	}

	// 清空确认函数
	function confirmClear() {
		return confirm('确定要清空所有数据吗？此操作不可恢复！');
	}
</script>

<h1>{data.title}</h1>

<!-- 数据列表 -->
<div
	style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 4px; border: 1px solid #dee2e6;"
>
	<h3>已保存的数据列表 ({data.testData.length} 条记录):</h3>

	{#if data.testData.length === 0}
		<p style="color: #6c757d; text-align: center; padding: 20px;">📝 暂无数据，请先提交一些内容</p>
	{:else}
		<div style="display: grid; gap: 10px;">
			{#each data.testData as item, index}
				<div
					style="
					background: white; 
					padding: 12px; 
					border-radius: 6px; 
					border: 1px solid #e9ecef;
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-shadow: 0 1px 3px rgba(0,0,0,0.1);
				"
				>
					<!-- 数据内容 -->
					<div style="flex: 1;">
						<div style="display: flex; align-items: center; gap: 10px;">
							<span
								style="
								background: #007bff; 
								color: white; 
								padding: 2px 8px; 
								border-radius: 12px; 
								font-size: 12px; 
								font-weight: bold;
							">#{item.id}</span
							>
							<span style="font-size: 16px; color: #212529;">
								{item.testInput}
							</span>
						</div>
					</div>

					<!-- 删除按钮 -->
					<div>
						{#if data.user.username === 'admin'}
							<form
								method="post"
								action="?/delete"
								use:enhance
								style="margin: 0;"
								onsubmit={(e) => {
									if (!confirmDelete(item)) {
										e.preventDefault();
									}
								}}
							>
								<input type="hidden" name="id" value={item.id} />
								<button
									type="submit"
									style="
										background: #dc3545; 
										color: white; 
										border: none; 
										padding: 6px 12px; 
										border-radius: 4px; 
										cursor: pointer;
										font-size: 12px;
										transition: background 0.2s;
									"
									onmouseenter={(e) => (e.target.style.background = '#c82333')}
									onmouseleave={(e) => (e.target.style.background = '#dc3545')}
								>
									🗑️ 删除
								</button>
							</form>
						{:else}
							<span style="color: #6c757d; font-size: 12px;"> 🔒 仅管理员可删除 </span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- 数据统计 -->
		<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
			<small style="color: #6c757d;">
				📊 共 {data.testData.length} 条记录
				{#if data.user.username === 'admin'}
					| 👑 管理员权限：可删除单条或清空所有数据
				{:else}
					| 👤 普通用户：仅可查看和添加数据
				{/if}
			</small>
		</div>
	{/if}
</div>

<!-- 提交表单 -->
<div style="background: #f0fff0; padding: 10px; margin: 10px 0; border-radius: 4px;">
	<h3>提交新数据:</h3>
	<form method="post" action="?/submit" use:enhance>
		<input type="text" name="testInput" placeholder="输入内容..." required />
		<button type="submit">提交</button>
	</form>
</div>

<!-- 清空所有数据 -->
<div style="background: #fff8f0; padding: 10px; margin: 10px 0; border-radius: 4px;">
	<h3>清空所有数据:</h3>
	{#if data.user.username === 'admin'}
		<form
			method="post"
			action="?/clear"
			use:enhance
			onsubmit={(e) => {
				if (!confirmClear()) {
					e.preventDefault();
				}
			}}
		>
			<button
				type="submit"
				style="background: #ff8800; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;"
			>
				清空所有数据
			</button>
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
</details>
