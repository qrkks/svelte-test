<script>
	export let data;

	const { user, permissions } = data;

	// 在浏览器控制台查看完整数据
	console.log('完整权限数据:', JSON.stringify(permissions, null, 2));
</script>

<svelte:head>
	<title>权限测试</title>
</svelte:head>

<nav>
	<ul>
		<li><a href="/test/test-permissions/seed">seed</a></li>
		<li><a href="/test/test-permissions/test-context">test-context</a></li>
	</ul>
</nav>

<div class="test-permissions">
	<h1>权限系统测试</h1>

	<div class="user-info">
		<h2>用户信息</h2>
		<p>用户ID: {user.id}</p>
		<p>用户名: {user.username}</p>
		<p>邮箱: {user.email}</p>
	</div>

	<div class="permissions-info">
		<h2>权限信息</h2>

		<h3>系统权限 ({permissions.system.length})</h3>
		<ul>
			{#each permissions.system as permission}
				<li>{permission}</li>
			{/each}
		</ul>

		<h3>组织权限 ({permissions.organizations.length})</h3>
		{#each permissions.organizations as org}
			<div class="organization">
				<h4>{org.organizationName} ({org.roleName})</h4>
				<p>权限 ({org.permissions.length}):</p>
				<ul>
					{#each org.permissions as permission}
						<li>{permission}</li>
					{/each}
				</ul>

				<h5>子组织 ({org.subOrganizations.length}):</h5>
				{#each org.subOrganizations as subOrg}
					<div class="sub-organization">
						<p><strong>{subOrg.subOrganizationName}</strong> ({subOrg.roleName})</p>
						<p>权限 ({subOrg.permissions.length}):</p>
						<ul>
							{#each subOrg.permissions as permission}
								<li>{permission}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- 添加原始数据显示 -->
	<div class="debug-info">
		<h3>调试信息</h3>
		<details>
			<summary>查看原始数据</summary>
			<pre>{JSON.stringify(permissions, null, 2)}</pre>
		</details>
	</div>
</div>

<style>
	.test-permissions {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.user-info,
	.permissions-info,
	.debug-info {
		background: var(--color-background-soft);
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
	}

	.organization {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
	}

	.sub-organization {
		margin-left: 1rem;
		padding: 0.5rem;
		background: var(--color-background);
		border-radius: 0.25rem;
		border: 1px solid var(--color-border);
	}

	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin: 0.25rem 0;
	}

	.debug-info pre {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 0.25rem;
		overflow-x: auto;
		font-size: 0.875rem;
		white-space: pre-wrap;
	}

	details {
		margin: 1rem 0;
	}

	summary {
		cursor: pointer;
		font-weight: 500;
		padding: 0.5rem;
		background: #e9ecef;
		border-radius: 0.25rem;
	}

	summary:hover {
		background: #dee2e6;
	}
</style>
