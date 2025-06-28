<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="max-w-md mx-auto p-6">
	<h1 class="text-2xl font-bold mb-6">账户管理</h1>
	
	<!-- 用户信息 -->
	<div class="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
		<h2 class="text-lg font-semibold mb-2">用户信息</h2>
		<p class="text-gray-600 dark:text-gray-400">用户名: <span class="font-medium">{data.user.username}</span></p>
		<p class="text-gray-600 dark:text-gray-400">用户ID: <span class="font-mono text-sm">{data.user.id}</span></p>
	</div>
	
	<!-- 账户操作 -->
	<div class="space-y-4">
		<!-- 修改密码链接 -->
		<a 
			href="/settings/auth/password"
			class="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
		>
			🔑 修改密码
		</a>
		
		<!-- 退出登录 -->
		<form method="post" action="?/logout" use:enhance>
			<button 
				type="submit"
				class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
			>
				🚪 退出登录
			</button>
		</form>
	</div>
</div>
