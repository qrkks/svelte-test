<!-- src/routes/settings/auth/register/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/components/ui/Toast.svelte';

	let { form } = $props();

	// 使用一个状态来追踪已经显示过的消息
	let lastShownMessage = $state('');

	$effect(() => {
		if (form?.message && form.message !== lastShownMessage) {
			lastShownMessage = form.message;
			toast.error(form.message);
		}
	});

	let formData = $state({
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		mobile: '',
		agreeTerms: false
	});

	let errors = $state({
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		mobile: ''
	});

	// 控制密码显示状态
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	// 客户端表单验证
	function validateForm() {
		let isValid = true;
		errors = {
			username: '',
			password: '',
			confirmPassword: '',
			email: '',
			mobile: ''
		};

		// 用户名验证
		if (!formData.username) {
			errors.username = '用户名不能为空';
			isValid = false;
		}

		// 密码验证
		if (!formData.password) {
			errors.password = '密码不能为空';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = '密码长度不能小于6位';
			isValid = false;
		}

		// 确认密码
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = '两次输入的密码不一致';
			isValid = false;
		}

		// 邮箱验证（可选）
		if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			errors.email = '邮箱格式不正确';
			isValid = false;
		}

		// 手机号验证（可选）
		if (formData.mobile && !formData.mobile.match(/^1[3-9]\d{9}$/)) {
			errors.mobile = '手机号格式不正确';
			isValid = false;
		}

		return isValid;
	}
</script>

/
<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">创建新账号</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			已有账号？
			<a href="/settings/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
				立即登录
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<form 
				method="POST" 
				action="?/register" 
				use:enhance={() => {
					// 表单提交时重置 lastShownMessage
					lastShownMessage = '';
					return async ({ result, formElement, formData,action }) => {
                        console.log(formElement, formData, action,result);
						if (result.type === 'success') {
							// 处理成功情况
						}
					};
				}} 
				class="space-y-6"
			>
				<!-- 用户名 -->
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700"> 用户名 </label>
					<div class="mt-1">
						<input
							bind:value={formData.username}
							id="username"
							name="username"
							type="text"
							required
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
						/>
					</div>
					{#if errors.username}
						<p class="mt-2 text-sm text-red-600">{errors.username}</p>
					{/if}
				</div>

				<!-- 密码 -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> 密码 </label>
					<div class="relative mt-1">
						<input
							bind:value={formData.password}
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<!-- 隐藏密码图标 -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 text-gray-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							{:else}
								<!-- 显示密码图标 -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 text-gray-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							{/if}
						</button>
					</div>
					{#if errors.password}
						<p class="mt-2 text-sm text-red-600">{errors.password}</p>
					{/if}
				</div>

				<!-- 确认密码 -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
						确认密码
					</label>
					<div class="relative mt-1">
						<input
							bind:value={formData.confirmPassword}
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							required
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{#if showConfirmPassword}
								<!-- 隐藏密码图标 -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 text-gray-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							{:else}
								<!-- 显示密码图标 -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-5 w-5 text-gray-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							{/if}
						</button>
					</div>
					{#if errors.confirmPassword}
						<p class="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
					{/if}
				</div>

				<!-- 邮箱（可选） -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> 邮箱（可选） </label>
					<div class="mt-1">
						<input
							bind:value={formData.email}
							id="email"
							name="email"
							type="email"
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
						/>
					</div>
					{#if errors.email}
						<p class="mt-2 text-sm text-red-600">{errors.email}</p>
					{/if}
				</div>

				<!-- 手机号（可选） -->
				<div>
					<label for="mobile" class="block text-sm font-medium text-gray-700">
						手机号（可选）
					</label>
					<div class="mt-1">
						<input
							bind:value={formData.mobile}
							id="mobile"
							name="mobile"
							type="tel"
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
						/>
					</div>
					{#if errors.mobile}
						<p class="mt-2 text-sm text-red-600">{errors.mobile}</p>
					{/if}
				</div>

				<!-- 同意条款 -->
				<div class="flex items-center">
					<input
						bind:checked={formData.agreeTerms}
						id="agreeTerms"
						name="agreeTerms"
						type="checkbox"
						required
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label for="agreeTerms" class="ml-2 block text-sm text-gray-900">
						我已阅读并同意
						<a href="/terms" class="text-blue-600 hover:text-blue-500">服务条款</a>
						和
						<a href="/privacy" class="text-blue-600 hover:text-blue-500">隐私政策</a>
					</label>
				</div>

				<!-- 错误信息显示 -->
				<p style="color: red">{form?.message ?? ''}</p>

				<!-- 提交按钮 -->
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						注册
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
