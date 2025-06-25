<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let count = $state(0);
	let hydrationSteps = $state([]);
	let currentStep = $state(0);
	
	// 记录步骤
	function addStep(step, description) {
		hydrationSteps = [...hydrationSteps, {
			step,
			description,
			time: new Date().toLocaleTimeString(),
			location: browser ? '🌐 客户端' : '🖥️ 服务端'
		}];
	}
	
	// 步骤1：脚本开始执行
	addStep(1, '📝 Svelte组件脚本开始执行');
	
	// 步骤2：变量初始化
	addStep(2, '🔧 状态变量初始化 (count = 0)');
	
	// 步骤3：函数定义
	addStep(3, '⚙️ 事件处理函数定义 (increment)');
	
	// 步骤4：HTML渲染
	addStep(4, '🏗️ HTML模板渲染');
	
	onMount(() => {
		// 步骤5：DOM挂载
		addStep(5, '🔗 DOM元素挂载到页面');
		
		// 步骤6：事件绑定
		setTimeout(() => {
			addStep(6, '⚡ 事件监听器绑定到DOM元素');
			currentStep = 6;
		}, 100);
		
		// 步骤7：水合完成
		setTimeout(() => {
			addStep(7, '💧 水合完成 - 按钮现在可以点击！');
			currentStep = 7;
		}, 200);
	});
	
	function increment() {
		count++;
		addStep(8, `🖱️ 按钮点击事件触发 (count = ${count})`);
	}
	
	// 模拟原生HTML按钮（没有事件）
	function simulateStaticButton() {
		alert('这是一个静态HTML按钮，没有绑定任何事件！');
	}
</script>

<div class="container">
	<h1>🔍 水合过程详细解析</h1>
	
	<div class="demo-section">
		<h2>🧪 实验对比：</h2>
		
		<div class="button-comparison">
			<div class="button-demo">
				<h3>💧 Svelte按钮（会水合）</h3>
				<button onclick={increment} class="svelte-btn">
					点击 +1 (count: {count})
				</button>
				<p class="status">
					{#if currentStep < 6}
						❌ 还不能点击（事件未绑定）
					{:else}
						✅ 可以点击（已水合）
					{/if}
				</p>
			</div>
			
			<div class="button-demo">
				<h3>🏗️ 原生HTML按钮（永远静态）</h3>
				<button class="static-btn" onclick={() => alert('我是原生HTML按钮')}>
					静态按钮
				</button>
				<p class="status">
					⚠️ 只有原生HTML功能
				</p>
			</div>
		</div>
	</div>
	
	<div class="process-section">
		<h2>🔄 水合过程步骤：</h2>
		<div class="steps">
			{#each hydrationSteps as step, index}
				<div class="step-item {index <= currentStep ? 'completed' : 'pending'}">
					<div class="step-number">{step.step}</div>
					<div class="step-content">
						<div class="step-description">{step.description}</div>
						<div class="step-meta">
							<span class="step-time">{step.time}</span>
							<span class="step-location">{step.location}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	
	<div class="explanation-section">
		<h2>🤔 为什么会这样？</h2>
		
		<div class="explanation-grid">
			<div class="explanation-card">
				<h3>🏗️ 服务端渲染时</h3>
				<div class="code-block">
					<pre><code>// Svelte代码
&lt;button onclick={increment}&gt;
  点击 +1
&lt;/button&gt;

// 生成的HTML
&lt;button class="svelte-btn"&gt;
  点击 +1
&lt;/button&gt;</code></pre>
				</div>
				<p>❌ 没有事件监听器！</p>
			</div>
			
			<div class="explanation-card">
				<h3>💧 客户端水合时</h3>
				<div class="code-block">
					<pre><code>// Svelte在客户端做的事：
const button = document.querySelector('.svelte-btn');
button.addEventListener('click', increment);

// 现在按钮有了事件监听器
button.onclick = increment;</code></pre>
				</div>
				<p>✅ 事件监听器绑定完成！</p>
			</div>
		</div>
	</div>
	
	<div class="timeline-section">
		<h2>⏱️ 时间线：</h2>
		<div class="timeline">
			<div class="timeline-item">
				<div class="timeline-marker server">🖥️</div>
				<div class="timeline-content">
					<h4>服务端（0ms）</h4>
					<p>生成静态HTML，按钮不能点击</p>
				</div>
			</div>
			
			<div class="timeline-item">
				<div class="timeline-marker network">🌐</div>
				<div class="timeline-content">
					<h4>网络传输（~100ms）</h4>
					<p>HTML发送到浏览器</p>
				</div>
			</div>
			
			<div class="timeline-item">
				<div class="timeline-marker client">💻</div>
				<div class="timeline-content">
					<h4>客户端渲染（~200ms）</h4>
					<p>显示页面，但按钮仍不能点击</p>
				</div>
			</div>
			
			<div class="timeline-item">
				<div class="timeline-marker hydration">💧</div>
				<div class="timeline-content">
					<h4>水合完成（~300ms）</h4>
					<p>JavaScript绑定事件，按钮可以点击！</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}
	
	.demo-section {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.button-comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin: 20px 0;
	}
	
	.button-demo {
		background: white;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		border: 2px solid #dee2e6;
	}
	
	.svelte-btn {
		background: #007bff;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		margin: 10px 0;
		transition: all 0.2s;
	}
	
	.svelte-btn:hover {
		background: #0056b3;
		transform: translateY(-1px);
	}
	
	.static-btn {
		background: #6c757d;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		margin: 10px 0;
	}
	
	.status {
		font-size: 14px;
		margin: 10px 0;
		font-weight: bold;
	}
	
	.process-section {
		margin: 30px 0;
	}
	
	.steps {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.step-item {
		display: flex;
		align-items: center;
		padding: 15px;
		border-radius: 8px;
		transition: all 0.3s;
	}
	
	.step-item.completed {
		background: #d4edda;
		border-left: 4px solid #28a745;
	}
	
	.step-item.pending {
		background: #f8f9fa;
		border-left: 4px solid #6c757d;
		opacity: 0.6;
	}
	
	.step-number {
		background: #007bff;
		color: white;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 15px;
		flex-shrink: 0;
	}
	
	.step-content {
		flex: 1;
	}
	
	.step-description {
		font-weight: bold;
		margin-bottom: 5px;
	}
	
	.step-meta {
		display: flex;
		gap: 15px;
		font-size: 12px;
		color: #6c757d;
	}
	
	.explanation-section {
		margin: 30px 0;
	}
	
	.explanation-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin: 20px 0;
	}
	
	.explanation-card {
		background: white;
		padding: 20px;
		border-radius: 8px;
		border: 1px solid #dee2e6;
	}
	
	.code-block {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 6px;
		margin: 15px 0;
		overflow-x: auto;
	}
	
	.code-block pre {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
	}
	
	.timeline-section {
		margin: 30px 0;
	}
	
	.timeline {
		position: relative;
		padding-left: 30px;
	}
	
	.timeline::before {
		content: '';
		position: absolute;
		left: 15px;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #dee2e6;
	}
	
	.timeline-item {
		position: relative;
		margin-bottom: 30px;
	}
	
	.timeline-marker {
		position: absolute;
		left: -22px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		border: 2px solid white;
	}
	
	.timeline-marker.server {
		background: #6c757d;
	}
	
	.timeline-marker.network {
		background: #17a2b8;
	}
	
	.timeline-marker.client {
		background: #ffc107;
	}
	
	.timeline-marker.hydration {
		background: #28a745;
	}
	
	.timeline-content {
		background: white;
		padding: 15px;
		border-radius: 8px;
		border: 1px solid #dee2e6;
		margin-left: 20px;
	}
	
	.timeline-content h4 {
		margin: 0 0 5px 0;
		color: #495057;
	}
	
	.timeline-content p {
		margin: 0;
		color: #6c757d;
	}
	
	@media (max-width: 768px) {
		.button-comparison,
		.explanation-grid {
			grid-template-columns: 1fr;
		}
	}
</style> 