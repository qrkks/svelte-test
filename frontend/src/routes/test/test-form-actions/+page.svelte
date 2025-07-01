<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let { data, form } = $props();

	$effect(() => {
		$inspect(data, form, page);
	});
</script>

<div>
	<h1>Test Form Actions</h1>
	<h2>Test data</h2>
	<ul>
		{#each data.testData as test, index}
			<li>{index + 1} {test.id} {test.testInput}
				<form class="inline-block" method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={test.id} />
					<button type="submit">删除</button>
				</form>
			</li>
		{/each}
	</ul>
</div>

<form method="post" action="?/insert" use:enhance>
	<input type="text" name="test" />
	<button type="submit">Submit</button>
</form>
