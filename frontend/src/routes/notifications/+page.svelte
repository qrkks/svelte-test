<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedNotifications: number[] = [];

	function toggleSelection(id: number) {
		if (selectedNotifications.includes(id)) {
			selectedNotifications = selectedNotifications.filter(n => n !== id);
		} else {
			selectedNotifications = [...selectedNotifications, id];
		}
	}

	function selectAll() {
		selectedNotifications = data.notifications.map(n => n.id);
	}

	function clearSelection() {
		selectedNotifications = [];
	}
</script>

<svelte:head>
	<title>通知列表</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">通知列表</h1>
		<div class="flex gap-2">
			{#if selectedNotifications.length > 0}
				<form method="POST" action="?/mark-read" use:enhance>
					<input type="hidden" name="notificationIds" value={selectedNotifications.join(',')} />
					<button type="submit" class="btn btn-primary btn-sm">
						标记选中为已读 ({selectedNotifications.length})
					</button>
				</form>
			{/if}
			<form method="POST" action="?/mark-all-read" use:enhance>
				<button type="submit" class="btn btn-secondary btn-sm">
					全部标记为已读
				</button>
			</form>
		</div>
	</div>

	<div class="stats mb-6">
		<div class="stat">
			<div class="stat-title">总通知数</div>
			<div class="stat-value">{data.totalCount}</div>
		</div>
		<div class="stat">
			<div class="stat-title">未读通知</div>
			<div class="stat-value text-warning">{data.unreadCount}</div>
		</div>
	</div>

	{#if data.notifications.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">暂无通知</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.notifications as notification}
				<div class="card bg-base-100 shadow-xl {notification.is_read ? 'opacity-75' : ''}">
					<div class="card-body">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-2">
									<h3 class="card-title text-lg">{notification.title}</h3>
									{#if notification.is_important}
										<span class="badge badge-warning">重要</span>
									{/if}
									{#if !notification.is_read}
										<span class="badge badge-primary">未读</span>
									{/if}
								</div>
								<p class="text-gray-600 mb-2">{notification.content}</p>
								<div class="text-sm text-gray-500">
									{new Date(notification.created_at).toLocaleString()}
								</div>
							</div>
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									class="checkbox"
									checked={selectedNotifications.includes(notification.id)}
									on:change={() => toggleSelection(notification.id)}
								/>
								{#if !notification.is_read}
									<form method="POST" action="?/mark-read" use:enhance>
										<input type="hidden" name="notificationId" value={notification.id} />
										<button type="submit" class="btn btn-sm btn-outline">
											标记已读
										</button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- 分页 -->
		{#if data.totalPages > 1}
			<div class="flex justify-center mt-6">
				<div class="join">
					{#if data.currentPage > 1}
						<a href="?page={data.currentPage - 1}" class="join-item btn">«</a>
					{/if}
					<button class="join-item btn btn-active">第 {data.currentPage} 页</button>
					{#if data.currentPage < data.totalPages}
						<a href="?page={data.currentPage + 1}" class="join-item btn">»</a>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div> 