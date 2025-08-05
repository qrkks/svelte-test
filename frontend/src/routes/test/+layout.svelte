<script lang="ts">
	import { page } from "$app/state";

	let { children } = $props();
</script>

<div>
	<h1>Test Layout</h1>
	{#if page.url.pathname !== '/test'}
		<a href="/test">test home</a>
	{/if}
	{@render children()}
</div>
