<script>
	import '../app.css';
	import { authState } from '$lib/stores/global/auth.svelte.js';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Navbar from '$lib/components/navigation/Navbar.svelte';

	let { children, data } = $props();

	// 单文件Toast引用
	let globalToastRef;

	// 一次性更新多个属性
	Object.assign(authState, { ...data.user });

	// $effect(() => {
	// 	$inspect(authState);
	// 	$inspect({...data.user});
	// 	console.log(crypto.randomUUID());
	// });
</script>

<!-- 导航栏 -->
<Navbar />

<!-- 主内容区域 -->
<main class="min-h-screen bg-gray-50 dark:bg-gray-900">
	{@render children()}
</main>

<!-- Toast 组件 -->
<Toast />