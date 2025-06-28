<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	
	let { data, form } = $props();
	
	// 表单状态
	let isSubmitting = $state(false);
</script>

<div class="max-w-md mx-auto p-6">
	<!-- 页面标题 -->
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">修改密码</h1>
		<p class="text-gray-600 dark:text-gray-400 mt-2">
			当前用户: <span class="font-medium">{data.user.username}</span>
		</p>
	</div>

	<!-- 成功/错误消息 -->
	{#if form?.success}
		<div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
			<p class="text-green-800">✅ {form.message}</p>
		</div>
	{:else if form?.message}
		<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
			<p class="text-red-800">❌ {form.message}</p>
		</div>
	{/if}

	<!-- 修改密码表单 -->
	<form 
		method="post" 
		action="?/changePassword" 
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
		class="space-y-6"
	>
		<div>
			<label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				当前密码
			</label>
			<input 
				type="password" 
				id="currentPassword"
				name="currentPassword" 
				required 
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				disabled={isSubmitting}
			>
		</div>

		<div>
			<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				新密码
			</label>
			<input 
				type="password" 
				id="newPassword"
				name="newPassword" 
				required 
				minlength="6"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				disabled={isSubmitting}
			>
			<p class="text-sm text-gray-500 mt-1">至少6个字符</p>
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				确认新密码
			</label>
			<input 
				type="password" 
				id="confirmPassword"
				name="confirmPassword" 
				required 
				minlength="6"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				disabled={isSubmitting}
			>
		</div>

		<button 
			type="submit" 
			disabled={isSubmitting}
			class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{isSubmitting ? '正在修改...' : '修改密码'}
		</button>
	</form>

	<!-- 返回链接 -->
	<div class="mt-6 text-center">
		<a 
			href="/settings/auth" 
			class="text-blue-600 hover:text-blue-700 text-sm"
		>
			← 返回账户管理
		</a>
	</div>
</div> 