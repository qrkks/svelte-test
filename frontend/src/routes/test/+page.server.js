const pages = import.meta.glob('/src/routes/test/**/+page.svelte', { eager: true });

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const testPages = [];
	
	for (const path in pages) {
		// 将文件路径转换为路由路径
		let route =
			path
				.replace('/src/routes/', '')
				.replace('/+page.svelte', '')
				.replace(/\/\([^)]+\)/g, '') || // 移除路由组
			'/';
		console.log('route', route);

		// 生成标题（从路径或映射）
		const title = route.split('/').pop()?.replace(/-/g, ' ') || '页面';
		console.log('title', title);

		// 添加到测试页面数组
		testPages.push({
			path: route,
			title: title
		});
	}
	
	// 返回数据到前端
	return {
		testPages
	};
}
