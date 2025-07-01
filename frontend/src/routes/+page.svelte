<script>
	import { authState } from '$lib/state/global/auth.svelte.js';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- 欢迎区域 -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				欢迎使用 Svelte 应用
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300">
				这是一个使用 SvelteKit 构建的现代化 Web 应用
			</p>
		</div>

		<!-- 用户信息卡片 -->
		{#if authState.isLoggedIn}
			<section aria-labelledby="user-info" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
				<h2 id="user-info" class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
					用户信息
				</h2>
				<dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<dt class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
							用户名
						</dt>
						<dd class="text-lg text-gray-900 dark:text-white">
							{authState.username}
						</dd>
					</div>
					<div>
						<dt class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
							角色
						</dt>
						<dd class="text-lg text-gray-900 dark:text-white">
							{authState.role}
						</dd>
					</div>
					<div>
						<dt class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
							用户ID
						</dt>
						<dd class="text-lg text-gray-900 dark:text-white">
							{authState.userId}
						</dd>
					</div>
					<div>
						<dt class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
							最后登录时间
						</dt>
						<dd class="text-lg text-gray-900 dark:text-white">
							{authState.lastLoginTime}
						</dd>
					</div>
				</dl>
			</section>
		{/if}

		<!-- 功能卡片 -->
		<section aria-labelledby="features-heading">
			<h2 id="features-heading" class="sr-only">应用功能</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<article class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
					<div class="text-3xl mb-4" aria-hidden="true">🚀</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						快速开始
					</h3>
					<p class="text-gray-600 dark:text-gray-300">
						探索应用的各种功能和特性
					</p>
				</article>

				<article class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
					<div class="text-3xl mb-4" aria-hidden="true">⚙️</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						设置中心
					</h3>
					<p class="text-gray-600 dark:text-gray-300">
						自定义应用设置和偏好
					</p>
				</article>

				<article class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
					<div class="text-3xl mb-4" aria-hidden="true">📊</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						数据统计
					</h3>
					<p class="text-gray-600 dark:text-gray-300">
						查看详细的数据分析报告
					</p>
				</article>
			</div>
		</section>
	</div>
</div>


