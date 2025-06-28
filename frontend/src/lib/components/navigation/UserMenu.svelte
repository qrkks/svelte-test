<script>
	import { authState } from '$lib/stores/global/auth.svelte.js';
	import { enhance } from '$app/forms';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';
	import NavLink from './NavLink.svelte';

	// 调试信息
	$effect(() => {
		console.log('UserMenu - authState:', authState);
		console.log('UserMenu - isLoggedIn:', authState.isLoggedIn);
		console.log('UserMenu - username:', authState.username);
	});

	// 获取用户头像字母
	function getAvatarLetter(username) {
		return username ? username.charAt(0).toUpperCase() : '?';
	}

	// 获取用户头像颜色
	function getAvatarColor(username) {
		if (!username) return 'bg-gray-500';
		
		const colors = [
			'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
			'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
		];
		
		// 根据用户名生成固定颜色
		const index = username.charCodeAt(0) % colors.length;
		return colors[index];
	}
</script>

<!-- 🔍 调试：显示组件状态 -->
<div class="text-xs text-gray-500 px-2">
	UserMenu: {authState.isLoggedIn ? `已登录(${authState.username})` : '未登录'}
</div>

<!-- 桌面端用户菜单 -->
<div class="hidden lg:block">
	{#if authState.isLoggedIn}
		<!-- 已登录：显示用户下拉菜单 -->
		<Dropdown placement="bottom-end">
			{#snippet trigger()}
				<button 
					class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					aria-label="用户菜单"
				>
					<!-- 用户头像 -->
					<div class="w-8 h-8 {getAvatarColor(authState.username)} rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
						{getAvatarLetter(authState.username)}
					</div>
					
					<!-- 用户信息 -->
					<div class="hidden sm:block text-left">
						<div class="text-sm font-medium text-gray-900 dark:text-white">
							{authState.username}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">
							{authState.role}
						</div>
					</div>
					
					<!-- 下拉箭头 -->
					<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
			{/snippet}
			
			{#snippet content({ close })}
				<div class="py-2 w-56">
					<!-- 用户信息头部 -->
					<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 {getAvatarColor(authState.username)} rounded-full flex items-center justify-center text-white font-semibold">
								{getAvatarLetter(authState.username)}
							</div>
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{authState.username}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">
									{authState.role}
								</div>
								{#if authState.userId}
									<div class="text-xs text-gray-400 dark:text-gray-500 font-mono">
										ID: {authState.userId.slice(0, 8)}...
									</div>
								{/if}
							</div>
						</div>
					</div>
					
					<!-- 菜单项 -->
					<div class="py-1">
						<!-- 个人资料 -->
						<a 
							href="/profile" 
							class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							onclick={close}
						>
							<span class="w-4 h-4">👤</span>
							<span>个人资料</span>
						</a>
						
						<!-- 账户设置 -->
						<a 
							href="/settings/auth" 
							class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							onclick={close}
						>
							<span class="w-4 h-4">⚙️</span>
							<span>账户设置</span>
						</a>
						
						<!-- 修改密码 -->
						<a 
							href="/settings/auth/password" 
							class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							onclick={close}
						>
							<span class="w-4 h-4">🔑</span>
							<span>修改密码</span>
						</a>
					</div>
					
					<!-- 分割线 -->
					<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
					
					<!-- 退出登录 -->
					<div class="py-1">
						<form method="POST" action="/settings/auth?/logout" use:enhance>
							<button 
								type="submit"
								class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
								onclick={close}
							>
								<span class="w-4 h-4">🚪</span>
								<span>退出登录</span>
							</button>
						</form>
					</div>
				</div>
			{/snippet}
		</Dropdown>
	{:else}
		<!-- 未登录：显示登录按钮 -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-2">
			<NavLink 
				href="/settings/auth/login"
				label="登录"
				icon="🔑"
			/>
		</div>
	{/if}
</div>

<!-- 移动端：简化显示 -->
<div class="lg:hidden">
	{#if authState.isLoggedIn}
		<!-- 移动端只显示头像 -->
		<div class="w-8 h-8 {getAvatarColor(authState.username)} rounded-full flex items-center justify-center text-white text-sm font-semibold">
			{getAvatarLetter(authState.username)}
		</div>
	{:else}
		<!-- 移动端登录按钮 -->
		<a 
			href="/settings/auth/login"
			class="text-sm bg-blue-600 text-white px-3 py-1 rounded"
		>
			登录
		</a>
	{/if}
</div> 