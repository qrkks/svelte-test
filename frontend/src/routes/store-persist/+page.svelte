<script>
	import { globalCounter, userSettings, shoppingCart, cartActions } from '$lib/stores/global-states.svelte.js';
	
	// 添加商品到购物车
	function addProduct() {
		const products = [
			{ id: 1, name: '苹果', price: 5 },
			{ id: 2, name: '香蕉', price: 3 },
			{ id: 3, name: '橙子', price: 4 }
		];
		const randomProduct = products[Math.floor(Math.random() * products.length)];
		cartActions.addItem(randomProduct);
	}
</script>

<div class="container">
	<h1>全局持久化状态示例</h1>
	
	<!-- 全局计数器 -->
	<div class="section">
		<h2>全局计数器</h2>
		<p class="value">计数: {globalCounter.value}</p>
		<div class="buttons">
			<button onclick={() => globalCounter.value++}>+1</button>
			<button onclick={() => globalCounter.value--}>-1</button>
			<button onclick={() => { globalCounter.clear(); globalCounter.value = 0; }}>重置</button>
		</div>
	</div>
	
	<!-- 用户设置 -->
	<div class="section">
		<h2>用户设置</h2>
		<div class="settings">
			<label>
				主题: 
				<select bind:value={userSettings.value.theme} onchange={() => userSettings.value = {...userSettings.value}}>
					<option value="light">浅色</option>
					<option value="dark">深色</option>
				</select>
			</label>
			
			<label>
				语言: 
				<select bind:value={userSettings.value.language} onchange={() => userSettings.value = {...userSettings.value}}>
					<option value="zh">中文</option>
					<option value="en">English</option>
				</select>
			</label>
			
			<label>
				<input 
					type="checkbox" 
					bind:checked={userSettings.value.notifications}
					onchange={() => userSettings.value = {...userSettings.value}}
				/>
				启用通知
			</label>
		</div>
		
		<div class="display">
			<p>当前设置: {JSON.stringify(userSettings.value, null, 2)}</p>
		</div>
	</div>
	
	<!-- 购物车 -->
	<div class="section">
		<h2>购物车</h2>
		<div class="cart-info">
			<p>商品数量: {shoppingCart.value.items.length}</p>
			<p>总价: ¥{shoppingCart.value.total}</p>
		</div>
		
		<div class="cart-items">
			{#each shoppingCart.value.items as item, index}
				<div class="item">
					{item.name} - ¥{item.price}
				</div>
			{/each}
		</div>
		
		<div class="buttons">
			<button onclick={addProduct}>添加随机商品</button>
			<button onclick={cartActions.clearCart}>清空购物车</button>
		</div>
	</div>
	
	<p class="tip">💡 这些状态在不同页面间共享，刷新页面也不会丢失！</p>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.section {
		background: #f8f9fa;
		padding: 20px;
		margin: 20px 0;
		border-radius: 8px;
		border: 1px solid #dee2e6;
	}
	
	.value {
		font-size: 1.2em;
		font-weight: bold;
		color: #007bff;
		margin: 10px 0;
	}
	
	.buttons {
		display: flex;
		gap: 10px;
		margin: 15px 0;
	}
	
	button {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		background: #007bff;
		color: white;
		cursor: pointer;
	}
	
	button:hover {
		background: #0056b3;
	}
	
	.settings {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 15px 0;
	}
	
	.settings label {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	
	.settings select, .settings input {
		padding: 5px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	
	.display {
		background: #e9ecef;
		padding: 10px;
		border-radius: 4px;
		margin: 10px 0;
	}
	
	.display p {
		font-family: monospace;
		font-size: 0.9em;
		white-space: pre-wrap;
		margin: 0;
	}
	
	.cart-info {
		background: #d4edda;
		padding: 10px;
		border-radius: 4px;
		margin: 10px 0;
	}
	
	.cart-items {
		margin: 10px 0;
	}
	
	.item {
		background: white;
		padding: 8px;
		margin: 5px 0;
		border-radius: 4px;
		border: 1px solid #ddd;
	}
	
	.tip {
		color: #6c757d;
		font-style: italic;
		text-align: center;
		margin-top: 30px;
	}
</style> 