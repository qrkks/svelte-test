<script>
	import { onMount } from 'svelte';
	
	let count = $state(0);
	let isHydrated = $state(false);
	let logs = $state([]);
	
	function addLog(message) {
		logs = [...logs, `${new Date().toLocaleTimeString()}: ${message}`];
	}
	
	// 这个会在服务端和客户端都执行
	addLog('📝 脚本开始执行（服务端+客户端都会执行）');
	
	onMount(() => {
		// 这个只在客户端执行
		isHydrated = true;
		addLog('💧 水合完成！现在按钮可以点击了');
	});
	
	function increment() {
		count++;
		addLog(`🖱️ 按钮被点击，count = ${count}`);
	}
</script>

<div class="demo-container">
	<h1>🌱 水合过程演示</h1>
	
	<div class="status-section">
		<h2>当前状态：</h2>
		<div class="status {isHydrated ? 'hydrated' : 'static'}">
			{#if isHydrated}
				💧 已水合 - 页面现在是交互式的！
			{:else}
				🏗️ 静态HTML - 按钮还不能点击
			{/if}
		</div>
	</div>
	
	<div class="interactive-section">
		<h2>交互测试：</h2>
		<div class="counter">
			<p>计数器: <strong>{count}</strong></p>
			<button onclick={increment} class="counter-btn">
				点击 +1
			</button>
			<p class="hint">
				{#if !isHydrated}
					⚠️ 如果你现在看到这个按钮，它还不能点击（除非JavaScript已经加载完成）
				{:else}
					✅ 现在按钮可以正常点击了！
				{/if}
			</p>
		</div>
	</div>
	
	<div class="explanation-section">
		<h2>🤔 什么是水合？</h2>
		<div class="explanation">
			<div class="step">
				<h3>1️⃣ 服务端渲染（SSR）</h3>
				<p>服务器执行Svelte代码，生成静态HTML：</p>
				<pre><code>&lt;button&gt;点击 +1&lt;/button&gt;
&lt;p&gt;计数器: &lt;strong&gt;0&lt;/strong&gt;&lt;/p&gt;</code></pre>
				<p>这时候HTML是"死"的，按钮不能点击</p>
			</div>
			
			<div class="step">
				<h3>2️⃣ 浏览器接收HTML</h3>
				<p>用户看到完整的页面，但还没有交互功能</p>
				<p>这就像一张"照片" - 看得见，摸不着</p>
			</div>
			
			<div class="step">
				<h3>3️⃣ JavaScript加载并执行</h3>
				<p>Svelte的客户端代码开始运行</p>
				<p>它会"认领"这些HTML元素，给它们绑定事件</p>
			</div>
			
			<div class="step">
				<h3>4️⃣ 水合完成 💧</h3>
				<p>HTML从"静态照片"变成"活的应用"</p>
				<p>按钮现在可以点击，状态可以改变</p>
			</div>
		</div>
	</div>
	
	<div class="logs-section">
		<h2>📋 执行日志：</h2>
		<div class="logs">
			{#each logs as log}
				<div class="log-item">{log}</div>
			{/each}
		</div>
	</div>
	
	<div class="analogy-section">
		<h2>🏠 生活中的类比：</h2>
		<div class="analogy">
			<p><strong>想象你买了一套家具：</strong></p>
			<ul>
				<li>📦 <strong>SSR</strong> = 厂家按照图纸生产好家具，打包发货</li>
				<li>🚚 <strong>HTML传输</strong> = 快递把家具送到你家</li>
				<li>📋 <strong>静态HTML</strong> = 家具摆在那里，但还没组装</li>
				<li>🔧 <strong>水合过程</strong> = 你按照说明书组装家具</li>
				<li>✅ <strong>水合完成</strong> = 家具组装好了，可以正常使用</li>
			</ul>
			<p><em>水合就是把"装在盒子里的家具"变成"可以使用的家具"的过程！</em></p>
		</div>
	</div>
</div>

<style>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}
	
	.status-section {
		background: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.status {
		padding: 15px;
		border-radius: 6px;
		font-weight: bold;
		text-align: center;
		font-size: 18px;
	}
	
	.status.static {
		background: #ffecb3;
		color: #f57f17;
		border: 2px solid #ffc107;
	}
	
	.status.hydrated {
		background: #c8e6c9;
		color: #2e7d32;
		border: 2px solid #4caf50;
	}
	
	.interactive-section {
		background: #e3f2fd;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.counter {
		text-align: center;
		padding: 20px;
	}
	
	.counter-btn {
		background: #2196f3;
		color: white;
		border: none;
		padding: 12px 24px;
		font-size: 16px;
		border-radius: 6px;
		cursor: pointer;
		margin: 10px;
		transition: background-color 0.2s;
	}
	
	.counter-btn:hover {
		background: #1976d2;
	}
	
	.counter-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
	
	.hint {
		font-size: 14px;
		color: #666;
		margin-top: 10px;
	}
	
	.explanation-section {
		margin: 30px 0;
	}
	
	.explanation {
		display: grid;
		gap: 15px;
	}
	
	.step {
		background: white;
		padding: 20px;
		border-radius: 8px;
		border-left: 4px solid #2196f3;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	
	.step h3 {
		margin: 0 0 10px 0;
		color: #1976d2;
	}
	
	.step pre {
		background: #f5f5f5;
		padding: 10px;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 14px;
	}
	
	.logs-section {
		background: #f9f9f9;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.logs {
		max-height: 200px;
		overflow-y: auto;
		background: white;
		padding: 15px;
		border-radius: 6px;
		border: 1px solid #ddd;
	}
	
	.log-item {
		padding: 5px 0;
		border-bottom: 1px solid #eee;
		font-family: monospace;
		font-size: 14px;
	}
	
	.log-item:last-child {
		border-bottom: none;
	}
	
	.analogy-section {
		background: #fff3e0;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
		border: 2px solid #ff9800;
	}
	
	.analogy ul {
		padding-left: 20px;
	}
	
	.analogy li {
		margin: 8px 0;
		line-height: 1.5;
	}
	
	.analogy em {
		display: block;
		margin-top: 15px;
		padding: 10px;
		background: rgba(255, 152, 0, 0.1);
		border-radius: 4px;
		text-align: center;
		font-weight: bold;
	}
</style> 