const pages = import.meta.glob('/src/routes/test/**/+page.svelte', { eager: true });

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// 提取可序列化的信息
	const pagesInfo = {};
	
	for (const path in pages) {
		const module = pages[path];
		pagesInfo[path] = {
			hasDefault: typeof module.default === 'function',
			defaultType: typeof module.default,
			moduleKeys: Object.keys(module),
			// 尝试获取组件名称（如果可能）
			componentName: module.default?.name || 'Unknown'
		};
	}
	
	return {
		pagesInfo,
		totalPages: Object.keys(pages).length,
		pagePaths: Object.keys(pages)
	};
} 