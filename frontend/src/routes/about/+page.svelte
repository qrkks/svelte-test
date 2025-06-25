<script>
	import { a } from './aboutStore.svelte.js';

	$effect.root(() => {
		$effect(() => {
			localStorage.setItem('a', JSON.stringify(a));
		});
	});
</script>

<h1>About</h1>
<div>
	<p>a.b: {a.b}</p>
</div>
<form action="">
	<input type="text" name="b" bind:value={a.b} />
	<button type="submit">Submit</button>
</form>
