<script>
	import { confirm } from '$lib/components/ui/ConfirmDialog.svelte';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import { authState } from '$lib/stores/global/auth.svelte';
	import { page } from '$app/state';
	let { data, form } = $props();

	$effect(() => {
		$inspect('data', data);
		$inspect('form', form);
		$inspect('page', page);
		$inspect('page.data', page.data);
		$inspect(page.data === data);
	});
</script>

<form method="POST" action="/settings/auth?/logout" use:enhance>
	<button
		type="button"
		onclick={async (e) => {
			const confirmed = await confirm.show({
				title: '退出登录',
				message: '确定要退出登录吗？',
				confirmText: '确定',
				cancelText: '取消'
			});

			if (confirmed) {
				// 用户确认后提交表单
				e.target.form.requestSubmit();
			}
		}}
	>
		退出登录
	</button>
</form>

<form method="POST" action="/settings/auth?/logout" use:enhance>
	<button
		type="button"
		onclick={async (e) => {
			const confirmed = await confirm.show({
				title: '退出登录',
				message: '确定要退出登录吗？',
				confirmText: '确定',
				cancelText: '取消',
				variant: 'danger'
			});
			if (confirmed) {
				await e.target.form.requestSubmit();
			}
			if (!authState.isLoggedIn) {
				toast.error('退出登录失败');
			} else {
				toast.success('退出登录成功');
			}
		}}>退出登录</button
	>
</form>

<form
	method="POST"
	action="/settings/auth?/logout"
	use:enhance={() => {
		// 只添加结果处理，不阻止默认行为
		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				toast.success('退出登录成功');
				console.log('result', result);
				console.log('data', data);
				console.log('result.data', result.data);
				console.log(data === result.data);
				await update(); // 手动触发重定向
			} else {
				toast.error('退出登录失败');
			}
		};
	}}
>
	<button
		type="button"
		onclick={async (e) => {
			const confirmed = await confirm.show({
				title: '退出登录',
				message: '确定要退出登录吗？',
				confirmText: '确定',
				cancelText: '取消',
				variant: 'danger'
			});

			if (confirmed) {
				e.target.form.requestSubmit();
			}
		}}
	>
		退出登录
	</button>
</form>
