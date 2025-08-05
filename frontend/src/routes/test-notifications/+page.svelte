<script lang="ts">
	import { enhance } from '$app/forms';

	let loading = false;
	let message = '';

	async function sendTestNotification() {
		loading = true;
		message = '';

		try {
			const response = await fetch('/api/notifications', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'group',
					title: '测试通知',
					content: '这是一个测试通知，发送时间：' + new Date().toLocaleString(),
					targets: [
						{ type: 'all_users' }
					],
					isImportant: false
				})
			});

			if (response.ok) {
				message = '测试通知发送成功！';
			} else {
				const error = await response.json();
				message = '发送失败：' + (error.error || '未知错误');
			}
		} catch (error) {
			message = '发送失败：' + (error instanceof Error ? error.message : '未知错误');
		} finally {
			loading = false;
		}
	}

	async function sendImportantNotification() {
		loading = true;
		message = '';

		try {
			const response = await fetch('/api/notifications', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'group',
					title: '重要通知',
					content: '这是一个重要的测试通知，请及时查看！发送时间：' + new Date().toLocaleString(),
					targets: [
						{ type: 'all_users' }
					],
					isImportant: true
				})
			});

			if (response.ok) {
				message = '重要通知发送成功！';
			} else {
				const error = await response.json();
				message = '发送失败：' + (error.error || '未知错误');
			}
		} catch (error) {
			message = '发送失败：' + (error instanceof Error ? error.message : '未知错误');
		} finally {
			loading = false;
		}
	}

	async function sendMultiTargetNotification() {
		loading = true;
		message = '';

		try {
			const response = await fetch('/api/notifications', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'group',
					title: '多目标通知',
					content: '这是一个发送给多个目标的通知，发送时间：' + new Date().toLocaleString(),
					targets: [
						{ type: 'all_users' },
						{ type: 'organization', id: 1 },
						{ type: 'role', id: 1 }
					],
					isImportant: false
				})
			});

			if (response.ok) {
				message = '多目标通知发送成功！';
			} else {
				const error = await response.json();
				message = '发送失败：' + (error.error || '未知错误');
			}
		} catch (error) {
			message = '发送失败：' + (error instanceof Error ? error.message : '未知错误');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>测试通知</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-2xl">
	<h1 class="text-2xl font-bold mb-6">测试通知系统</h1>

	{#if message}
		<div class="alert {message.includes('成功') ? 'alert-success' : 'alert-error'} mb-4">
			<span>{message}</span>
		</div>
	{/if}

	<div class="space-y-4">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">发送测试通知</h2>
				<p class="text-gray-600 mb-4">
					点击下面的按钮发送测试通知到不同目标
				</p>
				<div class="flex gap-4 flex-wrap">
					<button
						class="btn btn-primary"
						onclick={sendTestNotification}
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						发送普通通知
					</button>
					<button
						class="btn btn-warning"
						onclick={sendImportantNotification}
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						发送重要通知
					</button>
					<button
						class="btn btn-info"
						onclick={sendMultiTargetNotification}
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						发送多目标通知
					</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">查看通知</h2>
				<p class="text-gray-600 mb-4">
					点击下面的链接查看通知列表
				</p>
				<div class="flex gap-4">
					<a href="/notifications" class="btn btn-outline">
						查看通知列表
					</a>
					<a href="/notifications/send" class="btn btn-outline">
						发送新通知
					</a>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">API 端点</h2>
				<p class="text-gray-600 mb-4">
					通知系统的 API 端点：
				</p>
				<div class="space-y-2 text-sm">
					<div><code>GET /api/notifications</code> - 获取通知列表</div>
					<div><code>GET /api/notifications/unread-count</code> - 获取未读数量</div>
					<div><code>POST /api/notifications/[id]/read</code> - 标记为已读</div>
					<div><code>POST /api/notifications</code> - 发送通知（支持多目标）</div>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">多目标支持</h2>
				<p class="text-gray-600 mb-4">
					现在支持同时选择多个目标用户群体：
				</p>
				<div class="space-y-2 text-sm">
					<div>• <strong>所有用户</strong> - 发送给系统中的所有用户</div>
					<div>• <strong>指定组织</strong> - 发送给特定组织的成员</div>
					<div>• <strong>指定角色</strong> - 发送给具有特定角色的用户</div>
					<div>• <strong>子组织</strong> - 发送给子组织的成员</div>
					<div>• <strong>自定义条件</strong> - 根据自定义条件筛选用户</div>
				</div>
				<p class="text-sm text-blue-600 mt-2">
					可以同时选择多个目标，系统会自动去重，确保每个用户只收到一次通知。
				</p>
			</div>
		</div>
	</div>
</div> 