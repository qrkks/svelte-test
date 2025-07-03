<script>
	import { enhance } from '$app/forms';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import { confirm } from '$lib/components/ui/ConfirmDialog.svelte';

	let { data, form } = $props();
	let updateFnString = $state(''); // 存储函数的字符串表示
	let resultString = $state('');
	let formDataState = $state();
	let name = $state();

	function handleEnhance({ formData }) {
		console.log('form submitted before');
		console.log('formData', formData);
		console.log(Object.fromEntries(formData.entries())); // 推荐方式
		formDataState = Object.fromEntries(formData.entries());
		name = formData.get('name');
		return async ({ update, result }) => {
			console.log('form submitted after', update);
			updateFnString = update.toString(); // 将函数转换为字符串
			resultString = JSON.stringify(result, null, 2);
			// await update();
			if (result.type === 'success') {
				toast.success(result.data.message);
				update({ reset: true });
			} else {
				toast.error(result.data.message);
				update();
			}
		};
	}
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
<pre>{form ? JSON.stringify(form, null, 2) : '还没有form数据'}</pre>
<pre>update函数定义: {updateFnString}</pre>
<pre>result: {resultString}</pre>
<pre>formData: {JSON.stringify(formDataState, null, 2)}</pre>

{#if name}
	<pre>Hello {name}</pre>
{/if}

<form method="post" action="?/testEnhance" use:enhance={handleEnhance}>
	<input type="text" name="name" />
	<button type="submit">提交测试</button>
	<button
		type="button"
		onclick={() => {
			toast.success('Toast测试');
		}}>Toast测试</button
	>
</form>

<form
	method="post"
	action="?/testEnhance"
	use:enhance={async ({ cancel }) => {
		const isConfirm = await confirm.show({
			title: '确认提交吗？',
			message: '提交后将无法撤销',
			confirmText: '确认',
			cancelText: '取消'
		});
		if (!isConfirm) {
			cancel();
			toast.error('取消提交');
			return;
		}
		toast.success('确认提交');
		return async ({ update, result }) => {
			if (result.type === 'success') {
				toast.success(result.data.message);
				update({ reset: true });
			} else {
				toast.error(result.data.message);
				update();
			}
		};
	}}
>
	<input type="text" name="name" />
	<button type="submit">提交通过Confirm测试</button>
</form>
