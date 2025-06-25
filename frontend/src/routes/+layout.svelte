<script>
	import '../app.css';
	import { authState } from '$lib/stores/global/auth.svelte.js';

	let { children, data } = $props();

	// 一次性更新多个属性
	Object.assign(authState, {
		username: data.user.username,
		userId: data.user.id,
		lastLoginTime: data.user.lastLoginTime
	});

	$effect(() => {
		$inspect(authState);
	});

</script>

{@render children()}
