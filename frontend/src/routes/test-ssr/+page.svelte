<script>
	import { browser } from '$app/environment';
	
	// 这段代码会在服务端和客户端都执行！
	console.log('🚀 代码执行了！运行环境：', browser ? '客户端' : '服务端');
	console.log('📍 当前时间：', new Date().toISOString());
	
	let count = $state(0);
	
	// 模拟一些初始化逻辑
	if (browser) {
		console.log('🌐 客户端特有逻辑：可以访问localStorage');
		console.log('💾 localStorage中的数据：', localStorage.getItem('test') || '无');
	} else {
		console.log('🖥️ 服务端特有逻辑：生成初始HTML');
	}
	
	// 💥 这会导致水合失败！
	// 服务端显示一个值，客户端显示另一个值
	let randomValue = browser ? Math.random() : 0.5;
	
	// ✅ 正确的做法：确保两端一致
	let serverTime = '2024-01-01 12:00:00';  // 固定值，两端一致
</script>

<div class="container">
	<h1>SSR执行流程演示</h1>
	
	<div class="info-box">
		<h2>当前运行环境</h2>
		<p><strong>browser:</strong> {browser}</p>
		<p><strong>环境:</strong> {browser ? '客户端' : '服务端'}</p>
	</div>
	
	<div class="demo-section">
		<h2>交互测试</h2>
		<p>计数: {count}</p>
		<button onclick={() => {
			count++;
			console.log('🔄 按钮点击，计数更新为：', count);
		}}>+1</button>
		
		<button onclick={() => {
			if (browser) {
				localStorage.setItem('test', `点击时间: ${new Date().toLocaleTimeString()}`);
				console.log('💾 已保存到localStorage');
			}
		}}>保存到localStorage</button>
	</div>
	
	<!-- 水合失败演示 -->
	<div class="hydration-demo">
		<h2>💥 水合失败演示</h2>
		<p class="warning">随机值: {randomValue}</p>
		<p class="note">👆 这个值在服务端和客户端不一致，会导致水合失败！</p>
		<p class="success">服务器时间: {serverTime}</p>
		<p class="note">👆 这个值两端一致，水合正常</p>
	</div>
	
	<div class="explanation">
		<h2>🔍 观察要点</h2>
		<ol>
			<li><strong>打开浏览器开发者工具 → Console</strong></li>
			<li><strong>刷新页面</strong> - 你会看到两次console.log输出：
				<ul>
					<li>第一次：服务端执行（如果你运行了dev服务器，在终端中也能看到）</li>
					<li>第二次：客户端执行（在浏览器console中）</li>
				</ul>
			</li>
			<li><strong>点击按钮</strong> - 只会在客户端执行</li>
			<li><strong>观察随机值</strong> - 可能会看到水合错误警告</li>
		</ol>
	</div>
	
	<div class="note">
		<h3>⚠️ 重要提醒</h3>
		<p>这就是为什么我们需要用 <code>browser</code> 来判断环境，避免在服务端执行浏览器专有的API！</p>
		<p><strong>水合过程：</strong>客户端不是"对比"DOM，而是"激活"服务端生成的静态HTML，让它变成可交互的动态应用。</p>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}
	
	.info-box {
		background: #e3f2fd;
		padding: 15px;
		border-radius: 8px;
		border-left: 4px solid #2196f3;
		margin: 20px 0;
	}
	
	.demo-section {
		background: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.explanation {
		background: #fff3e0;
		padding: 20px;
		border-radius: 8px;
		border-left: 4px solid #ff9800;
		margin: 20px 0;
	}
	
	.note {
		background: #ffebee;
		padding: 15px;
		border-radius: 8px;
		border-left: 4px solid #f44336;
		margin: 20px 0;
	}
	
	button {
		background: #2196f3;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		margin: 5px;
		font-size: 14px;
	}
	
	button:hover {
		background: #1976d2;
	}
	
	code {
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: monospace;
	}
	
	ol, ul {
		margin: 10px 0;
		padding-left: 20px;
	}
	
	li {
		margin: 5px 0;
	}
	
	.hydration-demo {
		background: #fff8e1;
		padding: 20px;
		border-radius: 8px;
		border-left: 4px solid #ffc107;
		margin: 20px 0;
	}
	
	.warning {
		color: #d32f2f;
		font-weight: bold;
	}
	
	.success {
		color: #388e3c;
		font-weight: bold;
	}
	
	.note {
		font-size: 0.9em;
		color: #666;
		font-style: italic;
		margin: 5px 0;
	}
</style> 