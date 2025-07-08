<script>
    import { onMount } from 'svelte';
    
    let loading = false;
    let result = null;
    let targetUserId = '';
    let users = [];
    let loadingUsers = true;

    onMount(async () => {
        await loadUsers();
    });

    async function loadUsers() {
        try {
            const response = await fetch('/test-permissions/users');
            const data = await response.json();
            users = data.users || [];
            if (users.length > 0) {
                targetUserId = users[0].id.toString();
            }
        } catch (error) {
            console.error('加载用户列表失败:', error);
        } finally {
            loadingUsers = false;
        }
    }

    async function createTestData() {
        if (!targetUserId) {
            result = { success: false, error: '请选择用户' };
            return;
        }

        loading = true;
        result = null;
        
        try {
            const response = await fetch('/test-permissions/seed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: parseInt(targetUserId) })
            });
            
            const data = await response.json();
            result = data;
        } catch (error) {
            result = { success: false, error: error.message };
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>创建测试数据</title>
</svelte:head>

<div class="seed-page">
    <h1>创建测试数据</h1>
    
    <div class="description">
        <p>点击下面的按钮来创建权限系统的测试数据：</p>
        <ul>
            <li>系统角色：admin（系统管理员）</li>
            <li>主组织角色：会长</li>
            <li>相关权限配置</li>
            <li>用户角色分配</li>
        </ul>
    </div>
    
    <div class="user-selection">
        <label for="userId">选择要分配角色的用户：</label>
        {#if loadingUsers}
            <div class="loading">加载用户列表中...</div>
        {:else if users.length === 0}
            <div class="no-users">
                <p>没有找到用户，请先创建用户。</p>
                <a href="/settings/auth/register" class="btn-secondary">创建用户</a>
            </div>
        {:else}
            <select 
                id="userId" 
                bind:value={targetUserId} 
                class="select-field"
            >
                {#each users as user}
                    <option value={user.id}>
                        ID: {user.id} - {user.username} ({user.email || '无邮箱'})
                    </option>
                {/each}
            </select>
            <small>选择要分配管理员角色的用户</small>
        {/if}
    </div>
    
    <div class="actions">
        <button 
            onclick={createTestData} 
            disabled={loading || users.length === 0}
            class="btn-primary"
        >
            {loading ? '创建中...' : '创建测试数据'}
        </button>
    </div>
    
    {#if result}
        <div class="result {result.success ? 'success' : 'error'}">
            <h3>{result.success ? '成功' : '失败'}</h3>
            <p>{result.message || result.error}</p>
            
            {#if result.success}
                <div class="next-steps">
                    <p>测试数据创建成功！接下来你可以：</p>
                    <ul>
                        <li><a href="/test-permissions">查看权限测试页面</a></li>
                        <li><a href="/settings/auth/login">登录系统</a></li>
                    </ul>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .seed-page {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .description {
        background: #f8f9fa;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
    }
    
    .description ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    
    .user-selection {
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
    }
    
    .user-selection label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .select-field {
        display: block;
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        font-size: 1rem;
        background: white;
    }
    
    .select-field:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    
    .user-selection small {
        color: #6c757d;
        font-size: 0.875rem;
    }
    
    .loading {
        padding: 1rem;
        text-align: center;
        color: #6c757d;
    }
    
    .no-users {
        padding: 1rem;
        text-align: center;
        color: #6c757d;
    }
    
    .btn-secondary {
        display: inline-block;
        background: #6c757d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        text-decoration: none;
        margin-top: 0.5rem;
    }
    
    .btn-secondary:hover {
        background: #5a6268;
    }
    
    .actions {
        margin: 2rem 0;
        text-align: center;
    }
    
    .btn-primary {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
        background: #0056b3;
    }
    
    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #6c757d;
    }
    
    .result {
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    
    .result.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .result.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .next-steps {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid currentColor;
    }
    
    .next-steps ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    
    .next-steps a {
        color: inherit;
        text-decoration: underline;
    }
    
    .next-steps a:hover {
        text-decoration: none;
    }
    
    /* 深色主题支持 */
    @media (prefers-color-scheme: dark) {
        .btn-primary {
            background: #0d6efd;
            color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: #0b5ed7;
        }
        
        .description, .user-selection {
            background: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
        }
        
        .select-field {
            background: #4a5568;
            border-color: #718096;
            color: #e2e8f0;
        }
        
        .select-field:focus {
            border-color: #0d6efd;
        }
    }
</style> 