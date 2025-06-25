<script>
	import { 
		createLocalState, 
		createSessionState, 
		count, 
		user, 
		todos, 
		theme,
		resetAll 
	} from '$lib/stores/persisted-correct.svelte.js';
	
	// ========== 在组件中创建本地持久化状态 ==========
	
	// 1. 简单数值
	const localCount = createLocalState('demo-count', 0);
	
	// 2. 字符串
	const userName = createLocalState('demo-username', '');
	
	// 3. 布尔值
	const isDarkMode = createLocalState('demo-dark-mode', false);
	
	// 4. 对象
	const settings = createLocalState('demo-settings', {
		language: 'zh',
		notifications: true,
		volume: 50
	});
	
	// 5. 数组
	const shoppingList = createLocalState('demo-shopping', []);
	
	// 6. 会话存储（标签页关闭后消失）
	const tempNote = createSessionState('demo-temp-note', '');
	
	// ========== 组件内方法 ==========
	
	function increment() {
		localCount.value++;
	}
	
	function addTodo() {
		if (userName.value.trim()) {
			shoppingList.value = [...shoppingList.value, {
				id: Date.now(),
				text: userName.value,
				done: false
			}];
			userName.value = '';
		}
	}
	
	function toggleTodo(id) {
		shoppingList.value = shoppingList.value.map(item => 
			item.id === id ? { ...item, done: !item.done } : item
		);
	}
	
	function removeTodo(id) {
		shoppingList.value = shoppingList.value.filter(item => item.id !== id);
	}
	
	function updateVolume(event) {
		settings.value.volume = parseInt(event.target.value);
	}
	
	function resetAllDemo() {
		resetAll(localCount, userName, isDarkMode, settings, shoppingList, tempNote);
	}
	
	// ========== 使用全局状态 ==========
	
	function incrementGlobalCount() {
		count.value++;
	}
	
	function updateGlobalUser() {
		user.value.name = userName.value || 'Anonymous';
		user.value.preferences.language = settings.value.language;
	}
</script>

<div class="container" class:dark={isDarkMode.value}>
	<h1>🎯 持久化状态使用示例</h1>
	
	<!-- 基本数值操作 -->
	<section class="demo-section">
		<h2>📊 数值状态</h2>
		<div class="control-group">
			<p>本地计数器: <strong>{localCount.value}</strong></p>
			<button onclick={increment} class="btn-primary">+1</button>
			<button onclick={() => localCount.value = 0} class="btn-secondary">重置</button>
		</div>
		
		<div class="control-group">
			<p>全局计数器: <strong>{count.value}</strong></p>
			<button onclick={incrementGlobalCount} class="btn-primary">全局 +1</button>
			<button onclick={() => count.reset()} class="btn-secondary">重置</button>
		</div>
	</section>
	
	<!-- 字符串和布尔值 -->
	<section class="demo-section">
		<h2>📝 用户输入</h2>
		<div class="control-group">
			<label>
				用户名:
				<input 
					bind:value={userName.value} 
					placeholder="输入用户名..."
					class="input"
				/>
			</label>
		</div>
		
		<div class="control-group">
			<label class="checkbox-label">
				<input 
					type="checkbox" 
					bind:checked={isDarkMode.value}
				/>
				深色模式
			</label>
		</div>
	</section>
	
	<!-- 对象状态 -->
	<section class="demo-section">
		<h2>⚙️ 设置对象</h2>
		<div class="settings-grid">
			<label>
				语言:
				<select bind:value={settings.value.language} class="select">
					<option value="zh">中文</option>
					<option value="en">English</option>
					<option value="ja">日本語</option>
				</select>
			</label>
			
			<label class="checkbox-label">
				<input 
					type="checkbox" 
					bind:checked={settings.value.notifications}
				/>
				启用通知
			</label>
			
			<label>
				音量: {settings.value.volume}%
				<input 
					type="range" 
					min="0" 
					max="100" 
					value={settings.value.volume}
					oninput={updateVolume}
					class="slider"
				/>
			</label>
		</div>
	</section>
	
	<!-- 数组状态 -->
	<section class="demo-section">
		<h2>📋 购物清单 (数组操作)</h2>
		<div class="todo-section">
			<div class="todo-input">
				<input 
					bind:value={userName.value}
					placeholder="添加商品..."
					class="input"
					onkeydown={(e) => e.key === 'Enter' && addTodo()}
				/>
				<button onclick={addTodo} class="btn-primary">添加</button>
			</div>
			
			<div class="todo-list">
				{#each shoppingList.value as item (item.id)}
					<div class="todo-item" class:done={item.done}>
						<label class="checkbox-label">
							<input 
								type="checkbox" 
								checked={item.done}
								onchange={() => toggleTodo(item.id)}
							/>
							<span class:strikethrough={item.done}>
								{item.text}
							</span>
						</label>
						<button 
							onclick={() => removeTodo(item.id)} 
							class="btn-danger btn-small"
						>
							删除
						</button>
					</div>
				{/each}
				
				{#if shoppingList.value.length === 0}
					<p class="empty-state">购物清单是空的</p>
				{/if}
			</div>
		</div>
	</section>
	
	<!-- 会话存储 -->
	<section class="demo-section">
		<h2>📝 临时笔记 (sessionStorage)</h2>
		<div class="control-group">
			<textarea 
				bind:value={tempNote.value}
				placeholder="这个笔记只在当前标签页有效，关闭标签页后会消失..."
				rows="4"
				class="textarea"
			></textarea>
			<p class="hint">
				💡 这个数据存储在 sessionStorage 中，关闭标签页后会消失
			</p>
		</div>
	</section>
	
	<!-- 全局状态同步 -->
	<section class="demo-section">
		<h2>🌐 全局状态同步</h2>
		<div class="global-state">
			<div class="state-display">
				<h3>当前全局用户:</h3>
				<pre>{JSON.stringify(user.value, null, 2)}</pre>
			</div>
			<button onclick={updateGlobalUser} class="btn-primary">
				同步用户信息到全局状态
			</button>
		</div>
	</section>
	
	<!-- 重置操作 -->
	<section class="demo-section danger">
		<h2>🗑️ 重置操作</h2>
		<div class="control-group">
			<button onclick={resetAllDemo} class="btn-danger">
				重置所有演示数据
			</button>
			<p class="warning">
				⚠️ 这会清除所有演示相关的 localStorage 和 sessionStorage 数据
			</p>
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
		transition: all 0.3s ease;
	}
	
	.container.dark {
		background: #1a1a1a;
		color: white;
	}
	
	.demo-section {
		background: white;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
		border: 1px solid #e0e0e0;
	}
	
	.container.dark .demo-section {
		background: #2a2a2a;
		border-color: #444;
	}
	
	.demo-section.danger {
		border-color: #ff5722;
		background: #ffebee;
	}
	
	.container.dark .demo-section.danger {
		background: #3d1a1a;
	}
	
	.control-group {
		margin: 15px 0;
	}
	
	.settings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 15px;
	}
	
	.input, .select, .textarea {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
	}
	
	.container.dark .input,
	.container.dark .select,
	.container.dark .textarea {
		background: #3a3a3a;
		border-color: #555;
		color: white;
	}
	
	.slider {
		width: 100%;
		margin: 10px 0;
	}
	
	.btn-primary, .btn-secondary, .btn-danger {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		margin: 0 5px 5px 0;
		transition: background-color 0.2s;
	}
	
	.btn-primary {
		background: #2196f3;
		color: white;
	}
	
	.btn-primary:hover {
		background: #1976d2;
	}
	
	.btn-secondary {
		background: #757575;
		color: white;
	}
	
	.btn-secondary:hover {
		background: #616161;
	}
	
	.btn-danger {
		background: #f44336;
		color: white;
	}
	
	.btn-danger:hover {
		background: #d32f2f;
	}
	
	.btn-small {
		padding: 4px 8px;
		font-size: 12px;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}
	
	.todo-section {
		margin: 15px 0;
	}
	
	.todo-input {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
	}
	
	.todo-input .input {
		flex: 1;
	}
	
	.todo-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.todo-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background: #f5f5f5;
		border-radius: 4px;
	}
	
	.container.dark .todo-item {
		background: #3a3a3a;
	}
	
	.todo-item.done {
		opacity: 0.6;
	}
	
	.strikethrough {
		text-decoration: line-through;
	}
	
	.empty-state {
		text-align: center;
		color: #999;
		font-style: italic;
		padding: 20px;
	}
	
	.global-state {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 20px;
		align-items: start;
	}
	
	.state-display pre {
		background: #f5f5f5;
		padding: 15px;
		border-radius: 4px;
		font-size: 12px;
		overflow-x: auto;
	}
	
	.container.dark .state-display pre {
		background: #3a3a3a;
	}
	
	.hint {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}
	
	.container.dark .hint {
		color: #999;
	}
	
	.warning {
		font-size: 12px;
		color: #d32f2f;
		margin-top: 10px;
	}
	
	@media (max-width: 768px) {
		.global-state {
			grid-template-columns: 1fr;
		}
		
		.todo-input {
			flex-direction: column;
		}
	}
</style> 