<script>
	import { createPersistedState } from '$lib/stores/persisted-simple.svelte.js';

	// 创建一个简单的持久化计数器
	const counter = createPersistedState('simple-counter', 0);
</script>

<div class="container">
	<h1>最简单的持久化状态用例</h1>
	
	<div class="counter-section">
		<h2>持久化计数器</h2>
		<p class="count">当前计数: {counter.state.value}</p>
		
		<div class="buttons">
			<button onclick={() => counter.value++}>+1</button>
			<button onclick={() => counter.value--}>-1</button>
			<button onclick={counter.reset}>重置</button>
		</div>
		
		<p class="tip">💡 刷新页面，计数不会丢失！</p>
	</div>
</div>

<style>
	.container {
		max-width: 400px;
		margin: 50px auto;
		padding: 20px;
		text-align: center;
	}
	
	.counter-section {
		background: #f8f9fa;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	}
	
	.count {
		font-size: 2em;
		font-weight: bold;
		color: #007bff;
		margin: 20px 0;
	}
	
	.buttons {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin: 20px 0;
	}
	
	button {
		padding: 12px 20px;
		font-size: 1.1em;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	button:first-child {
		background: #28a745;
		color: white;
	}
	
	button:first-child:hover {
		background: #218838;
	}
	
	button:nth-child(2) {
		background: #dc3545;
		color: white;
	}
	
	button:nth-child(2):hover {
		background: #c82333;
	}
	
	button:last-child {
		background: #6c757d;
		color: white;
	}
	
	button:last-child:hover {
		background: #5a6268;
	}
	
	.tip {
		color: #6c757d;
		font-style: italic;
		margin-top: 20px;
	}
</style> 