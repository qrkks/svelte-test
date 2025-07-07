<script>
    import { enhance } from '$app/forms';
    import Toast from '$lib/components/ui/Toast.svelte';
    import { toastState } from '$lib/state/global/toast.svelte.js';

    let { data } = $props();
    
    // 当前选中的角色类型
    let selectedRoleType = $state('system');
    
    // 编辑状态
    let isEditing = $state(false);
    let editingRole = $state(null);
    
    // 表单数据
    let roleName = $state('');
    let roleDescription = $state('');

    // 用 $state 包裹角色数据，保证响应式
    let systemRoles = $state(data.systemRoles ?? []);
    let organizationRoles = $state(data.organizationRoles ?? []);
    let subOrganizationRoles = $state(data.subOrganizationRoles ?? []);

    // 切换角色类型
    function switchRoleType(type) {
        selectedRoleType = type;
        isEditing = false;
        editingRole = null;
        resetForm();
    }

    // 重置表单
    function resetForm() {
        roleName = '';
        roleDescription = '';
    }

    // 开始创建角色
    function startCreate() {
        isEditing = true;
        editingRole = null;
        resetForm();
    }

    // 开始编辑角色
    function startEdit(role) {
        isEditing = true;
        editingRole = role;
        roleName = role.name;
        roleDescription = role.description || '';
    }

    // 取消编辑
    function cancelEdit() {
        isEditing = false;
        editingRole = null;
        resetForm();
    }

    // 删除角色
    function deleteRole(role) {
        if (confirm(`确定要删除角色 "${role.name}" 吗？`)) {
            // 这里需要实现删除逻辑
            console.log('删除角色:', role);
        }
    }

    // 派生当前角色列表
    let currentRoles = $derived(() => {
        if (!data) return [];
        switch (selectedRoleType) {
            case 'system': return data.systemRoles ?? [];
            case 'organization': return data.organizationRoles ?? [];
            case 'subOrganization': return data.subOrganizationRoles ?? [];
            default: return [];
        }
    });

    // 获取角色类型名称
    function getRoleTypeName(type) {
        switch (type) {
            case 'system':
                return '系统角色';
            case 'organization':
                return '组织角色';
            case 'subOrganization':
                return '子组织角色';
            default:
                return '';
        }
    }

    // 调试信息
    console.log('data:', data);
    console.log('systemRoles:', data.systemRoles);
    console.log('organizationRoles:', data.organizationRoles);
    console.log('subOrganizationRoles:', data.subOrganizationRoles);
    console.log('currentRoles:', currentRoles);
    console.log('当前角色数量:', $currentRoles.length);
</script>

<svelte:head>
    <title>角色管理 - 系统设置</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">角色管理</h1>
        <p>创建和管理系统角色、组织角色和子组织角色</p>
    </div>

    <!-- 调试信息 -->
    <div class="mb-4 p-4 bg-gray-100 rounded">
        <p>调试信息:</p>
        <p>系统角色数量: {data.systemRoles?.length || 0}</p>
        <p>组织角色数量: {data.organizationRoles?.length || 0}</p>
        <p>子组织角色数量: {data.subOrganizationRoles?.length || 0}</p>
        <p>当前角色数量: {$currentRoles.length}</p>
    </div>

    <!-- 角色类型切换 -->
    <div class="mb-6">
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
                <button
                    type="button"
                    onclick={() => switchRoleType('system')}
                    class="py-2 px-1 border-b-2 font-medium text-sm {selectedRoleType === 'system' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                >
                    系统角色
                </button>
                <button
                    type="button"
                    onclick={() => switchRoleType('organization')}
                    class="py-2 px-1 border-b-2 font-medium text-sm {selectedRoleType === 'organization' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                >
                    组织角色
                </button>
                <button
                    type="button"
                    onclick={() => switchRoleType('subOrganization')}
                    class="py-2 px-1 border-b-2 font-medium text-sm {selectedRoleType === 'subOrganization' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                >
                    子组织角色
                </button>
            </nav>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 角色列表 -->
        <div class="lg:col-span-2">
            <div class="rounded-lg shadow-sm border">
                <div class="p-6 border-b">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-semibold">{getRoleTypeName(selectedRoleType)}</h2>
                            <p class="text-sm mt-1">管理 {getRoleTypeName(selectedRoleType).toLowerCase()}</p>
                        </div>
                        {#if !isEditing}
                            <button
                                type="button"
                                onclick={startCreate}
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                创建角色
                            </button>
                        {/if}
                    </div>
                </div>

                <div class="p-6">
                    {#if $currentRoles.length === 0}
                        <div class="text-center py-8">
                            <div class="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 class="mt-2 text-sm font-medium">暂无角色</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                还没有创建任何{getRoleTypeName(selectedRoleType).toLowerCase()}
                            </p>
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each $currentRoles as role}
                                <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div class="flex-1">
                                        <h3 class="font-medium">{role.name}</h3>
                                        {#if role.description}
                                            <p class="text-sm text-gray-600 mt-1">{role.description}</p>
                                        {/if}
                                        <p class="text-xs text-gray-400 mt-1">
                                            创建时间: {new Date(role.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button
                                            type="button"
                                            onclick={() => startEdit(role)}
                                            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            编辑
                                        </button>
                                        <button
                                            type="button"
                                            onclick={() => deleteRole(role)}
                                            class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
                                        >
                                            删除
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- 创建/编辑表单 -->
        <div class="lg:col-span-1">
            {#if isEditing}
                <div class="rounded-lg shadow-sm border">
                    <div class="p-6 border-b">
                        <h3 class="text-lg font-semibold">
                            {editingRole ? '编辑角色' : '创建角色'}
                        </h3>
                    </div>

                    <form method="post" action="?/save" use:enhance>
                        <input type="hidden" name="roleType" value={selectedRoleType} />
                        {#if editingRole}
                            <input type="hidden" name="roleId" value={editingRole.id} />
                        {/if}

                        <div class="p-6 space-y-4">
                            <div>
                                <label for="roleName" class="block text-sm font-medium text-gray-700 mb-2">
                                    角色名称
                                </label>
                                <input
                                    type="text"
                                    id="roleName"
                                    name="name"
                                    bind:value={roleName}
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="请输入角色名称"
                                />
                            </div>

                            <div>
                                <label for="roleDescription" class="block text-sm font-medium text-gray-700 mb-2">
                                    角色描述
                                </label>
                                <textarea
                                    id="roleDescription"
                                    name="description"
                                    bind:value={roleDescription}
                                    rows="3"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="请输入角色描述（可选）"
                                ></textarea>
                            </div>

                            <div class="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    {editingRole ? '保存修改' : '创建角色'}
                                </button>
                                <button
                                    type="button"
                                    onclick={cancelEdit}
                                    class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            {:else}
                <div class="rounded-lg shadow-sm border p-6">
                    <div class="text-center">
                        <div class="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 class="mt-2 text-sm font-medium">创建新角色</h3>
                        <p class="mt-1 text-sm text-gray-500">
                            点击"创建角色"按钮开始创建新的{getRoleTypeName(selectedRoleType).toLowerCase()}
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<Toast />
