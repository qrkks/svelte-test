<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let unreadCount = 0;
	let recentNotifications: any[] = [];
	let isDropdownOpen = false;
	let loading = false;

	async function fetchUnreadCount() {
		try {
			const response = await fetch('/api/notifications/unread-count');
			const data = await response.json();
			unreadCount = data.count;
		} catch (error) {
			console.error('获取未读数量失败:', error);
		}
	}

	async function fetchRecentNotifications() {
		try {
			loading = true;
			const response = await fetch('/api/notifications?limit=5');
			const data = await response.json();
			recentNotifications = data.notifications || [];
		} catch (error) {
			console.error('获取最近通知失败:', error);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(notificationId: number) {
		try {
			await fetch(`/api/notifications/${notificationId}/read`, {
				method: 'POST'
			});
			
			// 更新本地状态
			recentNotifications = recentNotifications.map(n => 
				n.id === notificationId ? { ...n, is_read: true } : n
			);
			
			// 重新获取未读数量
			await fetchUnreadCount();
		} catch (error) {
			console.error('标记已读失败:', error);
		}
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
		if (isDropdownOpen) {
			fetchRecentNotifications();
		}
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function goToNotifications() {
		goto('/notifications');
		closeDropdown();
	}

	onMount(() => {
		fetchUnreadCount();
	});
</script>

<div class="relative">
	<button
		class="btn btn-ghost btn-circle relative"
		on:click={toggleDropdown}
		on:blur={() => setTimeout(closeDropdown, 200)}
	>
		<svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 17h5l-5 5v-5zM4.83 2.83A4 4 0 0 1 9 2h6a4 4 0 0 1 4.17 2.83L20 7H4l.83-4.17zM20 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7"
			/>
		</svg>
		
		{#if unreadCount > 0}
			<span class="absolute -top-1 -right-1 badge badge-primary badge-sm">
				{unreadCount > 99 ? '99+' : unreadCount}
			</span>
		{/if}
	</button>

	{#if isDropdownOpen}
		<div class="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-lg border z-50">
			<div class="p-4 border-b">
				<div class="flex justify-between items-center">
					<h3 class="font-semibold">通知</h3>
					<button
						class="text-sm text-primary hover:underline"
						on:click={goToNotifications}
					>
						查看全部
					</button>
				</div>
			</div>

			<div class="max-h-96 overflow-y-auto">
				{#if loading}
					<div class="p-4 text-center">
						<span class="loading loading-spinner loading-sm"></span>
						<span class="ml-2">加载中...</span>
					</div>
				{:else if recentNotifications.length === 0}
					<div class="p-4 text-center text-gray-500">
						暂无通知
					</div>
				{:else}
					{#each recentNotifications as notification}
						<div class="p-4 border-b hover:bg-base-200 {notification.is_read ? 'opacity-75' : ''}">
							<div class="flex justify-between items-start">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<h4 class="font-medium text-sm">{notification.title}</h4>
										{#if notification.is_important}
											<span class="badge badge-warning badge-xs">重要</span>
										{/if}
										{#if !notification.is_read}
											<span class="badge badge-primary badge-xs">未读</span>
										{/if}
									</div>
									<p class="text-sm text-gray-600 mb-1 line-clamp-2">
										{notification.content}
									</p>
									<div class="text-xs text-gray-500">
										{new Date(notification.created_at).toLocaleString()}
									</div>
								</div>
								{#if !notification.is_read}
									<button
										class="btn btn-xs btn-outline ml-2"
										on:click={() => markAsRead(notification.id)}
									>
										已读
									</button>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div> 