<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1>Test</h1>

{#if form?.success}
	<div style="color: green; margin: 10px 0; padding: 10px; background: #e8f5e8; border-radius: 4px;">
		{form.message}
	</div>
{/if}

{#if form?.message && !form?.success}
	<div style="color: red; margin: 10px 0; padding: 10px; background: #ffe8e8; border-radius: 4px;">
		{form.message}
	</div>
{/if}

<form method="post" action="?/submit" use:enhance>
	<label for="testInput">Test Input</label>
	<input 
		type="text" 
		name="testInput" 
		id="testInput"
		value={form?.testInput ?? ''}
		placeholder="请输入内容..."
		style="margin: 10px 0; padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;"
	/>

	<button type="submit" style="margin-left: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
		Submit
	</button>
</form>
