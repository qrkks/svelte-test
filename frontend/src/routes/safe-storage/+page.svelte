<script>
	import { storage, sessionStorage } from '$lib/utils/safe-storage.js';
	
	let userInfo = $state({
		name: '',
		age: '',
		hobbies: []
	});
	
	let newHobby = $state('');
	
	// 页面加载时从存储中恢复数据
	userInfo = storage.get('userInfo', { name: '', age: '', hobbies: [] });
	
	// 保存用户信息到localStorage
	function saveUserInfo() {
		storage.set('userInfo', userInfo);
		alert('用户信息已保存到localStorage！');
	}
	
	// 保存到sessionStorage
	function saveToSession() {
		sessionStorage.set('sessionData', {
			timestamp: new Date().toISOString(),
			userInfo: userInfo
		});
		alert('数据已保存到sessionStorage！');
	}
	
	// 添加爱好
	function addHobby() {
		if (newHobby.trim()) {
			userInfo.hobbies = [...userInfo.hobbies, newHobby.trim()];
			newHobby = '';
		}
	}
	
	// 删除爱好
	function removeHobby(index) {
		userInfo.hobbies = userInfo.hobbies.filter((_, i) => i !== index);
	}
	
	// 清除所有数据
	function clearAll() {
		storage.clear();
		sessionStorage.clear();
		userInfo = { name: '', age: '', hobbies: [] };
		alert('所有存储数据已清除！');
	}
	
	// 显示存储信息
	function showStorageInfo() {
		const keys = storage.keys();
		const sessionData = sessionStorage.get('sessionData');
		
		alert(`
localStorage键: ${keys.join(', ') || '无'}
sessionStorage数据: ${sessionData ? JSON.stringify(sessionData, null, 2) : '无'}
		`);
	}
</script>

<div class="container">
	<h1>安全存储工具演示</h1>
	
	<div class="intro">
		<h2>🛡️ 优势</h2>
		<ul>
			<li>✅ <strong>SSR安全</strong> - 自动处理服务端环境</li>
			<li>✅ <strong>自动序列化</strong> - 支持对象、数组等复杂类型</li>
			<li>✅ <strong>错误处理</strong> - 优雅处理存储异常</li>
			<li>✅ <strong>简单易用</strong> - 不需要记住browser判断</li>
		</ul>
	</div>
	
	<div class="demo-section">
		<h2>用户信息管理</h2>
		
		<div class="form-group">
			<label>
				姓名:
				<input bind:value={userInfo.name} placeholder="输入姓名" />
			</label>
			
			<label>
				年龄:
				<input type="number" bind:value={userInfo.age} placeholder="输入年龄" />
			</label>
		</div>
		
		<div class="hobbies-section">
			<h3>爱好管理</h3>
			<div class="add-hobby">
				<input bind:value={newHobby} placeholder="添加新爱好" />
				<button onclick={addHobby}>添加</button>
			</div>
			
			<div class="hobbies-list">
				{#each userInfo.hobbies as hobby, index}
					<div class="hobby-item">
						<span>{hobby}</span>
						<button onclick={() => removeHobby(index)}>删除</button>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="actions">
			<button onclick={saveUserInfo} class="save">保存到localStorage</button>
			<button onclick={saveToSession} class="session">保存到sessionStorage</button>
			<button onclick={showStorageInfo} class="info">查看存储信息</button>
			<button onclick={clearAll} class="clear">清除所有数据</button>
		</div>
	</div>
	
	<div class="code-example">
		<h2>💻 使用示例</h2>
		<pre><code>{`// 导入工具
import { storage, sessionStorage } from '$lib/utils/safe-storage.js';

// 使用 - 任何地方都安全！
storage.set('user', { name: 'John', age: 25 });
const user = storage.get('user', { name: '', age: 0 });

sessionStorage.set('temp', 'temporary data');
const temp = sessionStorage.get('temp', '');

// 不需要担心SSR问题，不需要browser判断！`}</code></pre>
	</div>
	
	<div class="current-data">
		<h2>📊 当前数据</h2>
		<pre>{JSON.stringify(userInfo, null, 2)}</pre>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}
	
	.intro {
		background: #e8f5e8;
		padding: 20px;
		border-radius: 8px;
		border-left: 4px solid #4caf50;
		margin: 20px 0;
	}
	
	.intro ul {
		margin: 10px 0;
		padding-left: 20px;
	}
	
	.demo-section {
		background: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.form-group {
		display: grid;
		gap: 15px;
		margin: 20px 0;
	}
	
	.form-group label {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-weight: bold;
	}
	
	.form-group input {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
	}
	
	.hobbies-section {
		margin: 20px 0;
	}
	
	.add-hobby {
		display: flex;
		gap: 10px;
		margin: 10px 0;
	}
	
	.add-hobby input {
		flex: 1;
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	
	.hobbies-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 15px 0;
	}
	
	.hobby-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: white;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #eee;
	}
	
	.actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin: 20px 0;
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
		background: #2196f3;
		color: white;
	}
	
	.save:hover {
		background: #1976d2;
	}
	
	.session {
		background: #ff9800;
		color: white;
	}
	
	.session:hover {
		background: #f57c00;
	}
	
	.info {
		background: #9c27b0;
		color: white;
	}
	
	.info:hover {
		background: #7b1fa2;
	}
	
	.clear {
		background: #f44336;
		color: white;
	}
	
	.clear:hover {
		background: #d32f2f;
	}
	
	.hobby-item button {
		background: #f44336;
		color: white;
		padding: 4px 8px;
		font-size: 12px;
	}
	
	.add-hobby button {
		background: #4caf50;
		color: white;
	}
	
	.code-example {
		background: #263238;
		color: #f5f5f5;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}
	
	.code-example pre {
		margin: 0;
		overflow-x: auto;
	}
	
	.code-example code {
		font-family: 'Courier New', monospace;
		font-size: 14px;
		line-height: 1.5;
	}
	
	.current-data {
		background: #e3f2fd;
		padding: 20px;
		border-radius: 8px;
		border-left: 4px solid #2196f3;
		margin: 20px 0;
	}
	
	.current-data pre {
		background: white;
		padding: 15px;
		border-radius: 4px;
		overflow-x: auto;
		font-family: 'Courier New', monospace;
		font-size: 14px;
	}
</style> 