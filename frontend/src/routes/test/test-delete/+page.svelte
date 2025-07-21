<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	let deletingIds = $state(new Set());
	deletingIds.add(5);
</script>

<h2>Test Delete</h2>

<ul>
	{#each data.testList as test}
		<li>
			{test.id} - {test.testInput}
			<form
				class="inline-block"
				action="?/delete"
				method="post"
				use:enhance={({ formElement, formData, action, cancel, submitter }) => {
					console.log('enhance formData', formData);
					console.log('enhance action', action);
					console.log('enhance cancel', cancel);
					console.log('enhance submitter', submitter);
					console.log('enhance formElement', formElement);
					formData.append('timestamp', Date.now());

					return async ({ result, update }) => {
						console.log(result);
						update({ reset: false });
					};
				}}
			>
				<input type="hidden" name="id" value={test.id} />
				<button type="submit">
					<!-- {#if !deletingIds.has(test.id)}
                        Delete
                    {:else}
                        <div class='inline-block w-4 h-4 rounded-full border-b-2 border-gray-500 animate-spin'></div>
                    {/if} -->
					{@html deletingIds.has(test.id)
						? `<div class='inline-block w-4 h-4 rounded-full border-b-2 border-gray-500 animate-spin'/>`
						: 'Delete'}
				</button>
			</form>
		</li>
	{/each}
</ul>
