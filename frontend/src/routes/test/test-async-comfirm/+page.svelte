<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { confirm } from '$lib/components/ui/ConfirmDialog.svelte';

	let { data, form } = $props();

	// 删除确认 - 使用新的异步方式
	async function confirmDelete(item, formElement) {
		const result = await confirm.show({
			title: '删除确认',
			message: `确定要删除这条数据吗？\n内容：${item.testInput}`,
			confirmText: '删除',
			cancelText: '取消',
			danger: true
		});

		if (result) {
			// 用户确认删除，触发表单提交事件（不绕过 enhance）
			formElement.requestSubmit();
		}
	}

	// 清空确认 - 使用新的异步方式
	async function confirmClear(formElement) {
		const result = await confirm.show({
			title: '清空所有数据',
			message: '确定要清空所有数据吗？此操作不可恢复！',
			confirmText: '清空',
			cancelText: '取消',
			danger: true
		});

		if (result) {
			// 用户确认清空，触发表单提交事件（不绕过 enhance）
			formElement.requestSubmit();
		}
	}

	// 也可以使用便捷方法
	async function quickDelete(item, formElement) {
		if (await confirm.delete(`确定要删除"${item.testInput}"吗？`)) {
			formElement.requestSubmit();
		}
	}
</script>

<h1>{data.title}</h1>

<!-- 新组件说明 -->
<div
	style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; margin: 10px 0; border-radius: 8px;"
>
	<h3 style="color: #0056b3; margin-top: 0;">✨ 已升级到新的异步确认对话框</h3>
	<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
		<!-- 旧方式 -->
		<div style="background: #fff2f2; padding: 12px; border-radius: 6px; border: 1px solid #ffdddd;">
			<h4 style="color: #d73502; margin-top: 0;">❌ 旧方式 (已弃用)</h4>
			<pre style="font-size: 11px; color: #666; margin: 0;"><code
					>// 回调方式
function confirmDelete() &#123;
  showConfirm(&#123;
    title: '删除确认',
    onConfirm: () => &#123;
      // 处理逻辑
    &#125;
  &#125;);
&#125;</code
				></pre>
		</div>

		<!-- 新方式 -->
		<div style="background: #f0fff4; padding: 12px; border-radius: 6px; border: 1px solid #c3e6cb;">
			<h4 style="color: #155724; margin-top: 0;">✅ 新方式 (推荐)</h4>
			<pre style="font-size: 11px; color: #666; margin: 0;"><code
					>// 异步方式
async function confirmDelete() &#123;
  const result = await confirm.show(&#123;
    title: '删除确认'
  &#125;);
  if (result) &#123;
    // 处理逻辑
  &#125;
&#125;</code
				></pre>
		</div>
	</div>

	<div style="margin-top: 12px; font-size: 14px;">
		<strong>🎯 新组件优势：</strong>
		<span style="color: #0056b3;"
			>无需管理本地状态 | 支持便捷方法 | 支持复杂异步流程 | 代码更简洁现代</span
		>
	</div>

	<div
		style="margin-top: 12px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; font-size: 13px;"
	>
		<strong>⚠️ 重要修复：</strong>
		使用
		<code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">requestSubmit()</code>
		而不是
		<code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">submit()</code>，
		避免绕过
		<code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">use:enhance</code> 导致页面刷新
	</div>
</div>

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
					<div style="display: flex; gap: 8px;">
						{#if data.user.username === 'admin'}
							<!-- 方式1：完整配置的删除确认 -->
							<form method="post" action="?/delete" use:enhance style="margin: 0;">
								<input type="hidden" name="id" value={item.id} />
								<button
									type="button"
									onclick={(e) => confirmDelete(item, e.target.closest('form'))}
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
									title="使用完整配置确认"
								>
									🗑️ 删除
								</button>
							</form>

							<!-- 方式2：便捷方法删除确认 -->
							<form method="post" action="?/delete" use:enhance style="margin: 0;">
								<input type="hidden" name="id" value={item.id} />
								<button
									type="button"
									onclick={(e) => quickDelete(item, e.target.closest('form'))}
									style="
										background: #fd7e14; 
										color: white; 
										border: none; 
										padding: 6px 12px; 
										border-radius: 4px; 
										cursor: pointer;
										font-size: 12px;
										transition: background 0.2s;
									"
									onmouseenter={(e) => (e.target.style.background = '#e8610e')}
									onmouseleave={(e) => (e.target.style.background = '#fd7e14')}
									title="使用便捷方法确认"
								>
									⚡ 快删
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
		<form method="post" action="?/clear" use:enhance>
			<button
				type="button"
				onclick={(e) => confirmClear(e.target.closest('form'))}
				style="background: #ff8800; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;"
			>
				清空所有数据
			</button>
		</form>
	{:else}
		<p style="color: #e74c3c;">❌ 权限不足，只有管理员可以清空所有数据</p>
	{/if}
</div>

<!-- 全局确认框组件已在 Layout 中添加，无需重复 -->

<!-- 调试信息 -->
<details>
	<summary>调试信息</summary>
	<pre>data: {JSON.stringify(data, null, 2)}</pre>
	<pre>form: {JSON.stringify(form, null, 2)}</pre>
	<pre>browser: {browser}</pre>
</details>
