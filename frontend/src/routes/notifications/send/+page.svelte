<script lang="ts">
	import { enhance } from '$app/forms';

	let form = $state<any>();
	let targetType = $state('all_users');
	let targetId = $state('');
	let isImportant = $state(false);

	const targetTypeOptions = [
		{ value: 'all_users', label: '所有用户' },
		{ value: 'organization', label: '指定组织' },
		{ value: 'role', label: '指定角色' },
		{ value: 'sub_organization', label: '子组织' },
		{ value: 'custom', label: '自定义条件' }
	];
</script>

<svelte:head>
	<title>发送通知</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-2xl">
	<h1 class="text-2xl font-bold mb-6">发送通知</h1>

	{#if form?.error}
		<div class="alert alert-error mb-4">
			<span>{form.error}</span>
		</div>
	{/if}

	{#if form?.success}
		<div class="alert alert-success mb-4">
			<span>通知发送成功！</span>
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-6">
		<div class="form-control">
			<label for="title" class="label">
				<span class="label-text">通知标题 *</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				class="input input-bordered"
				required
				placeholder="请输入通知标题"
			/>
		</div>

		<div class="form-control">
			<label for="content" class="label">
				<span class="label-text">通知内容 *</span>
			</label>
			<textarea
				id="content"
				name="content"
				class="textarea textarea-bordered h-32"
				required
				placeholder="请输入通知内容"
			></textarea>
		</div>

		<div class="form-control">
			<label for="targetType" class="label">
				<span class="label-text">目标类型 *</span>
			</label>
			<select id="targetType" name="targetType" bind:value={targetType} class="select select-bordered">
				{#each targetTypeOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		{#if targetType === 'organization' || targetType === 'role'}
			<div class="form-control">
				<label for="targetId" class="label">
					<span class="label-text">
						{targetType === 'organization' ? '组织ID' : '角色ID'} *
					</span>
				</label>
				<input
					type="number"
					id="targetId"
					name="targetId"
					bind:value={targetId}
					class="input input-bordered"
					required
					placeholder="请输入ID"
				/>
			</div>
		{/if}

		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text">重要通知</span>
				<input
					type="checkbox"
					name="isImportant"
					bind:checked={isImportant}
					class="checkbox"
				/>
			</label>
		</div>

		<div class="flex gap-4">
			<button type="submit" class="btn btn-primary">
				发送通知
			</button>
			<a href="/notifications" class="btn btn-outline">
				返回列表
			</a>
		</div>
	</form>
</div> 