<!-- 统一错误页面 -->
<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	let { error, status } = page;
</script>

<div>
	<h1>错误页面</h1>
	<p>发生了错误</p>
	<p>错误信息: {error?.message}</p>
	<p>错误堆栈: {error?.stack}</p>
	<p>错误状态: {status}</p>
	<div>
		<h2>错误详情</h2>
		<pre>{JSON.stringify(error, null, 2)}</pre>
	</div>
	<button onclick={() => goto('/')}>返回首页</button>
	<button onclick={() => history.back()}>返回上一页</button>
</div>
