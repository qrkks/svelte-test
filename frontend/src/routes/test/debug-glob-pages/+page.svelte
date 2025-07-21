<script>
	let { data } = $props();
	let { pagesInfo, totalPages, pagePaths } = data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Pages 调试信息</h1>
	
	<div class="mb-4">
		<h2 class="text-xl font-semibold">总页面数: {totalPages}</h2>
	</div>
	
	<div class="mb-4">
		<h2 class="text-xl font-semibold">页面路径:</h2>
		<ul class="list-disc list-inside">
			{#each pagePaths as path}
				<li class="text-sm text-gray-600">{path}</li>
			{/each}
		</ul>
	</div>
	
	<div>
		<h2 class="text-xl font-semibold">详细信息:</h2>
		{#each Object.entries(pagesInfo) as [path, info]}
			<div class="border p-3 mb-2 rounded">
				<h3 class="font-medium">{path}</h3>
				<ul class="text-sm text-gray-600">
					<li>有默认导出: {info.hasDefault}</li>
					<li>默认导出类型: {info.defaultType}</li>
					<li>组件名称: {info.componentName}</li>
					<li>模块键: {info.moduleKeys.join(', ')}</li>
				</ul>
			</div>
		{/each}
	</div>
</div> 