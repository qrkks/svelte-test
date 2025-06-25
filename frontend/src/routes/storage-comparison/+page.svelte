<script>
	import { storage, sessionStorage } from '$lib/utils/safe-storage.js';
	
	let localData = $state('');
	let sessionData = $state('');
	let testMessage = $state('');
	
	// 页面加载时读取数据
	localData = storage.get('localTest', '');
	sessionData = sessionStorage.get('sessionTest', '');
	
	function saveToLocal() {
		storage.set('localTest', localData);
		testMessage = '✅ 已保存到localStorage - 关闭标签页重新打开，数据仍然存在！';
		setTimeout(() => testMessage = '', 3000);
	}
	
	function saveToSession() {
		sessionStorage.set('sessionTest', sessionData);
		testMessage = '✅ 已保存到sessionStorage - 关闭标签页重新打开，数据会消失！';
		setTimeout(() => testMessage = '', 3000);
	}
	
	function clearLocal() {
		storage.remove('localTest');
		localData = '';
		testMessage = '🗑️ localStorage数据已清除';
		setTimeout(() => testMessage = '', 2000);
	}
	
	function clearSession() {
		sessionStorage.remove('sessionTest');
		sessionData = '';
		testMessage = '🗑️ sessionStorage数据已清除';
		setTimeout(() => testMessage = '', 2000);
	}
	
	function openNewTab() {
		window.open(window.location.href, '_blank');
		testMessage = '🆕 新标签页已打开 - 观察localStorage数据是否共享，sessionStorage数据是否独立！';
		setTimeout(() => testMessage = '', 4000);
	}
</script>

<div class="container">
	<h1>localStorage vs sessionStorage</h1>
	
	<div class="comparison-grid">
		<!-- localStorage部分 -->
		<div class="storage-section local">
			<h2>🔄 localStorage</h2>
			<div class="features">
				<p>✅ 永久保存（除非手动删除）</p>
				<p>✅ 所有标签页共享</p>
				<p>✅ 适合用户偏好、设置等</p>
			</div>
			
			<div class="demo-area">
				<textarea 
					bind:value={localData} 
					placeholder="输入要保存到localStorage的数据..."
					rows="3"
				></textarea>
				<div class="buttons">
					<button onclick={saveToLocal} class="save">保存到localStorage</button>
					<button onclick={clearLocal} class="clear">清除</button>
				</div>
			</div>
		</div>
		
		<!-- sessionStorage部分 -->
		<div class="storage-section session">
			<h2>⏱️ sessionStorage</h2>
			<div class="features">
				<p>⚡ 标签页关闭后消失</p>
				<p>🔒 仅当前标签页可用</p>
				<p>📝 适合临时数据、草稿等</p>
			</div>
			
			<div class="demo-area">
				<textarea 
					bind:value={sessionData} 
					placeholder="输入要保存到sessionStorage的数据..."
					rows="3"
				></textarea>
				<div class="buttons">
					<button onclick={saveToSession} class="save">保存到sessionStorage</button>
					<button onclick={clearSession} class="clear">清除</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- 测试区域 -->
	<div class="test-section">
		<h2>🧪 测试区域</h2>
		<div class="test-buttons">
			<button onclick={openNewTab} class="test">打开新标签页测试</button>
		</div>
		
		<div class="instructions">
			<h3>📋 测试步骤：</h3>
			<ol>
				<li>在两个输入框中分别输入不同的内容</li>
				<li>点击对应的保存按钮</li>
				<li>点击"打开新标签页测试"</li>
				<li>观察新标签页中的数据：
					<ul>
						<li><strong>localStorage数据</strong> 会出现在新标签页中</li>
						<li><strong>sessionStorage数据</strong> 在新标签页中是空的</li>
					</ul>
				</li>
				<li>关闭所有标签页，重新打开网站</li>
				<li>观察数据：
					<ul>
						<li><strong>localStorage数据</strong> 仍然存在</li>
						<li><strong>sessionStorage数据</strong> 已经消失</li>
					</ul>
				</li>
			</ol>
		</div>
	</div>
	
	{#if testMessage}
		<div class="message">
			{testMessage}
		</div>
	{/if}
	
	<div class="use-cases">
		<h2>💡 使用场景</h2>
		<div class="cases-grid">
			<div class="case local-case">
				<h3>localStorage适合：</h3>
				<ul>
					<li>用户偏好设置（主题、语言）</li>
					<li>登录状态</li>
					<li>购物车内容</li>
					<li>用户自定义配置</li>
					<li>离线数据缓存</li>
				</ul>
			</div>
			
			<div class="case session-case">
				<h3>sessionStorage适合：</h3>
				<ul>
					<li>表单草稿</li>
					<li>多步骤表单的当前步骤</li>
					<li>临时搜索历史</li>
					<li>页面间传递的临时数据</li>
					<li>会话级别的状态管理</li>
				</ul>
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
	
	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin: 30px 0;
	}
	
	.storage-section {
		padding: 20px;
		border-radius: 8px;
		border: 2px solid;
	}
	
	.local {
		border-color: #2196f3;
		background: #e3f2fd;
	}
	
	.session {
		border-color: #ff9800;
		background: #fff3e0;
	}
	
	.features {
		margin: 15px 0;
	}
	
	.features p {
		margin: 8px 0;
		font-size: 14px;
	}
	
	.demo-area {
		margin: 20px 0;
	}
	
	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: inherit;
		resize: vertical;
		box-sizing: border-box;
	}
	
	.buttons {
		display: flex;
		gap: 10px;
		margin-top: 10px;
	}
	
	button {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.2s;
	}
	
	.save {
		background: #4caf50;
		color: white;
	}
	
	.save:hover {
		background: #45a049;
	}
	
	.clear {
		background: #f44336;
		color: white;
	}
	
	.clear:hover {
		background: #da190b;
	}
	
	.test {
		background: #9c27b0;
		color: white;
	}
	
	.test:hover {
		background: #7b1fa2;
	}
	
	.test-section {
		background: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		margin: 30px 0;
	}
	
	.test-buttons {
		margin: 20px 0;
	}
	
	.instructions {
		background: white;
		padding: 20px;
		border-radius: 6px;
		border-left: 4px solid #2196f3;
	}
	
	.instructions ol {
		margin: 10px 0;
		padding-left: 20px;
	}
	
	.instructions li {
		margin: 8px 0;
	}
	
	.instructions ul {
		margin: 8px 0;
		padding-left: 20px;
	}
	
	.message {
		background: #d4edda;
		color: #155724;
		padding: 15px;
		border-radius: 4px;
		border: 1px solid #c3e6cb;
		margin: 20px 0;
		text-align: center;
		font-weight: bold;
	}
	
	.use-cases {
		margin: 40px 0;
	}
	
	.cases-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin: 20px 0;
	}
	
	.case {
		padding: 20px;
		border-radius: 8px;
		border: 2px solid;
	}
	
	.local-case {
		border-color: #2196f3;
		background: #e3f2fd;
	}
	
	.session-case {
		border-color: #ff9800;
		background: #fff3e0;
	}
	
	.case ul {
		margin: 10px 0;
		padding-left: 20px;
	}
	
	.case li {
		margin: 6px 0;
	}
	
	@media (max-width: 768px) {
		.comparison-grid,
		.cases-grid {
			grid-template-columns: 1fr;
		}
	}
</style> 