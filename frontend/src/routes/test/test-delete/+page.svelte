<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data } = $props();
	let deletingIds = $state<number[]>([]);
	onMount(() => {
		deletingIds.push(3);
		deletingIds.push(15);
		// deletingIds = deletingIds.filter((id) => id !== 15);
	});
	$inspect(deletingIds);
</script>

<h2>Test Delete</h2>
<p>deletingIds: {JSON.stringify(deletingIds)}</p>
<ul>
	{#each data.testList as test}
		<li>
			{test.id} - {test.testInput}
			<form
				class="inline-block"
				action="?/delete"
				method="post"
				use:enhance={({ formElement, formData, action, cancel, submitter }) => {
					return async ({ result, update }) => {
						console.log(result);
						update({ reset: false });
					};
				}}
			>
				<input type="hidden" name="id" value={test.id} />
				<button type="submit" disabled={deletingIds.includes(test.id)}>
					{@html deletingIds.includes(test.id)
						? `<div class='inline-block w-4 h-4 rounded-full border-b-2 border-gray-500 animate-spin'/>`
						: 'Delete'}
				</button>
			</form>
		</li>
	{/each}
</ul>
