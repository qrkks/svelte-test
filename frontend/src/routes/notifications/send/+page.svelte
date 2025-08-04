<script lang="ts">
	import { enhance } from '$app/forms';
	import { TARGET_TYPES, TARGET_TYPE_CONFIG } from '$lib/types/notification';

	let form = $state<any>();
	let isImportant = $state(false);
	let targets = $state<Array<{ type: string; id?: string; conditions?: any }>>([
		{ type: TARGET_TYPES.ALL_USERS }
	]);

	const targetTypeOptions = Object.entries(TARGET_TYPE_CONFIG).map(([value, config]) => ({
		value,
		label: config.label
	}));

	function addTarget() {
		targets = [...targets, { type: TARGET_TYPES.ALL_USERS }];
	}

	function removeTarget(index: number) {
		if (targets.length > 1) {
			targets = targets.filter((_, i) => i !== index);
		}
	}

	function updateTarget(index: number, field: string, value: any) {
		targets = targets.map((target, i) => 
			i === index ? { ...target, [field]: value } : target
		);
	}

	function getTargetConfig(type: string) {
		return TARGET_TYPE_CONFIG[type as keyof typeof TARGET_TYPE_CONFIG];
	}
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

		<!-- 多选目标 -->
		<div class="form-control">
			<div class="label">
				<span class="label-text">目标用户 *</span>
				<button type="button" class="btn btn-sm btn-outline" onclick={addTarget}>
					添加目标
				</button>
			</div>
			
			<div class="space-y-4">
				{#each targets as target, index}
					<div class="card bg-base-200 p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-medium">目标 {index + 1}</h3>
							{#if targets.length > 1}
								<button 
									type="button" 
									class="btn btn-sm btn-error btn-outline"
									onclick={() => removeTarget(index)}
								>
									删除
								</button>
							{/if}
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="form-control">
								<label for="target-type-{index}" class="label">
									<span class="label-text">目标类型</span>
								</label>
								<select 
									id="target-type-{index}"
									class="select select-bordered"
									bind:value={target.type}
									onchange={(e) => {
										const target = e.target as HTMLSelectElement;
										if (target) {
											updateTarget(index, 'type', target.value);
										}
									}}
								>
									{#each targetTypeOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</div>

							{#if getTargetConfig(target.type)?.requiresId}
								<div class="form-control">
									<label for="target-id-{index}" class="label">
										<span class="label-text">
											{getTargetConfig(target.type)?.label} ID
										</span>
									</label>
									<input
										id="target-id-{index}"
										type="number"
										class="input input-bordered"
										bind:value={target.id}
										oninput={(e) => {
											const target = e.target as HTMLInputElement;
											if (target) {
												updateTarget(index, 'id', target.value);
											}
										}}
										placeholder="请输入ID"
									/>
								</div>
							{/if}
						</div>

						<!-- 隐藏字段用于表单提交 -->
						<input type="hidden" name="targets[{index}][type]" value={target.type} />
						{#if target.id}
							<input type="hidden" name="targets[{index}][id]" value={target.id} />
						{/if}
					</div>
				{/each}
			</div>
		</div>

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