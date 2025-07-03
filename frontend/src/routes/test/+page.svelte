<script>
	let { data } = $props();
	let { testPages: pages } = data;
	console.log('pages', pages);
</script>

<div class="flex h-screen flex-col items-center justify-start gap-4">
	<ul>
		{#each pages as page}
			<li>
				<a href={page.path}>{page.title}</a>
			</li>
		{/each}
	</ul>
</div>
