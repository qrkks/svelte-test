<script>
    import { enhance } from '$app/forms';
    import Dropdown from '$lib/components/ui/Dropdown.svelte';
    import Toast from '$lib/components/ui/Toast.svelte';
    import { toastState } from '$lib/state/global/toast.svelte.js';

    let { data, form } = $props();

    // 使用 $state runes 定义响应式状态
    let selectedUser = $state(null);
    let selectedSystemRoles = $state(new Set());
    let selectedOrganizationRoles = $state(new Map()); // orgId -> roleId
    let selectedSubOrganizationRoles = $state(new Map()); // subOrgId -> roleId
    let isEditing = $state(false);

    // 使用 $state 而不是 $derived 来存储当前用户的角色
    let currentUserSystemRoles = $state([]);
    let currentUserOrganizationRoles = $state([]);
    let currentUserSubOrganizationRoles = $state([]);
    let currentUserHasAnyRoles = $state(false);

    // 选择用户
    function selectUser(user) {
        selectedUser = user;
        isEditing = false;
        
        // 重置选择状态
        selectedSystemRoles.clear();
        selectedOrganizationRoles.clear();
        selectedSubOrganizationRoles.clear();
        
        // 直接使用 data 来获取用户当前角色
        const userSystemRoles = data.userSystemRoles.filter(ur => ur.userId === user.id);
        const userOrganizationRoles = data.userOrganizationRoles.filter(ur => ur.userId === user.id);
        const userSubOrganizationRoles = data.userSubOrganizationRoles.filter(ur => ur.userId === user.id);
        
        // 更新当前用户角色状态
        currentUserSystemRoles = userSystemRoles;
        currentUserOrganizationRoles = userOrganizationRoles;
        currentUserSubOrganizationRoles = userSubOrganizationRoles;
        currentUserHasAnyRoles = userSystemRoles.length > 0 || userOrganizationRoles.length > 0 || userSubOrganizationRoles.length > 0;
        
        // 加载用户当前角色到选择状态
        userSystemRoles.forEach(ur => {
            selectedSystemRoles.add(ur.systemRoleId);
        });
        
        userOrganizationRoles.forEach(ur => {
            selectedOrganizationRoles.set(ur.organizationId, ur.organizationRoleId);
        });
        
        userSubOrganizationRoles.forEach(ur => {
            selectedSubOrganizationRoles.set(ur.subOrganizationId, ur.subOrganizationRoleId);
        });
        
        // 调试信息
        console.log('选择用户:', user.username);
        console.log('系统角色数量:', userSystemRoles.length);
        console.log('组织角色数量:', userOrganizationRoles.length);
        console.log('子组织角色数量:', userSubOrganizationRoles.length);
        console.log('是否有角色:', currentUserHasAnyRoles);
    }

    // 切换系统角色选择
    function toggleSystemRole(roleId) {
        if (selectedSystemRoles.has(roleId)) {
            selectedSystemRoles.delete(roleId);
        } else {
            selectedSystemRoles.add(roleId);
        }
    }

    // 切换组织角色选择
    function toggleOrganizationRole(orgId, roleId) {
        if (selectedOrganizationRoles.get(orgId) === roleId) {
            selectedOrganizationRoles.delete(orgId);
        } else {
            selectedOrganizationRoles.set(orgId, roleId);
        }
    }

    // 切换子组织角色选择
    function toggleSubOrganizationRole(subOrgId, roleId) {
        if (selectedSubOrganizationRoles.get(subOrgId) === roleId) {
            selectedSubOrganizationRoles.delete(subOrgId);
        } else {
            selectedSubOrganizationRoles.set(subOrgId, roleId);
        }
    }

    // 获取组织名称
    function getOrganizationName(orgId) {
        return data.organizations.find(org => org.id === orgId)?.name || '未知组织';
    }

    // 获取子组织名称
    function getSubOrganizationName(subOrgId) {
        return data.subOrganizations.find(subOrg => subOrg.id === subOrgId)?.name || '未知子组织';
    }

    // 获取角色名称
    function getSystemRoleName(roleId) {
        return data.systemRoles.find(role => role.id === roleId)?.name || '未知角色';
    }

    function getOrganizationRoleName(roleId) {
        return data.organizationRoles.find(role => role.id === roleId)?.name || '未知角色';
    }

    function getSubOrganizationRoleName(roleId) {
        return data.subOrganizationRoles.find(role => role.id === roleId)?.name || '未知角色';
    }

    // 处理表单提交
    function handleSubmit() {
        if (!selectedUser) {
            toastState.show('请先选择用户', 'error');
            return;
        }
    }

    // 开始编辑
    function startEdit() {
        if (!selectedUser) {
            toastState.show('请先选择用户', 'error');
            return;
        }
        isEditing = true;
    }

    // 取消编辑
    function cancelEdit() {
        isEditing = false;
        // 重新加载用户当前角色
        selectUser(selectedUser);
    }
</script>

<svelte:head>
    <title>用户角色管理 - 系统设置</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">用户角色管理</h1>
        <p>管理系统用户的角色分配和权限</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 用户列表 -->
        <div class="lg:col-span-1">
            <div class="rounded-lg shadow-sm border">
                <div class="p-6 border-b">
                    <h2 class="text-lg font-semibold">用户列表</h2>
                </div>
                <div class="p-4">
                    <div class="space-y-2 max-h-96 overflow-y-auto">
                        {#each data.users as user}
                            <button
                                type="button"
                                onclick={() => selectUser(user)}
                                class="w-full text-left p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 {selectedUser?.id === user.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}"
                            >
                                <div class="font-medium">{user.username}</div>
                                <div class="text-sm">
                                    {user.email || user.mobile || '无联系方式'}
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- 角色分配区域 -->
        <div class="lg:col-span-2">
            {#if selectedUser}
                <div class="rounded-lg shadow-sm border">
                    <div class="p-6 border-b">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold">
                                    为 {selectedUser.username} 分配角色
                                </h2>
                                <p class="text-sm mt-1">
                                    管理用户的系统角色、组织角色和子组织角色
                                </p>
                            </div>
                            <div class="flex gap-2">
                                {#if !isEditing}
                                    <button
                                        type="button"
                                        onclick={startEdit}
                                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        编辑角色
                                    </button>
                                {:else}
                                    <button
                                        type="button"
                                        onclick={cancelEdit}
                                        class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        取消
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <form method="post" action="?/save" use:enhance={handleSubmit}>
                        <input type="hidden" name="userId" value={selectedUser.id} />
                        
                        <div class="p-6 space-y-8">
                            <!-- 系统角色 -->
                            <div>
                                <h3 class="text-md font-semibold mb-4">系统角色</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {#each data.systemRoles as role}
                                        <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200 {isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}">
                                            <input
                                                type="checkbox"
                                                name="systemRoleIds"
                                                value={role.id}
                                                checked={selectedSystemRoles.has(role.id)}
                                                onchange={() => toggleSystemRole(role.id)}
                                                disabled={!isEditing}
                                                class="mr-3 h-4 w-4"
                                            />
                                            <div>
                                                <div class="font-medium">{role.name}</div>
                                                {#if role.description}
                                                    <div class="text-sm">{role.description}</div>
                                                {/if}
                                            </div>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <!-- 主组织角色 -->
                            <div>
                                <h3 class="text-md font-semibold mb-4">主组织角色</h3>
                                <div class="space-y-4">
                                    {#each data.organizations as org}
                                        <div class="border rounded-lg p-4">
                                            <h4 class="font-medium mb-3">{org.name}</h4>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {#each data.organizationRoles as role}
                                                    <label class="flex items-center p-2 border rounded hover:bg-gray-50 transition-colors duration-200 {isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}">
                                                        <input
                                                            type="radio"
                                                            name="organizationRolePairs"
                                                            value="{org.id}-{role.id}"
                                                            checked={selectedOrganizationRoles.get(org.id) === role.id}
                                                            onchange={() => toggleOrganizationRole(org.id, role.id)}
                                                            disabled={!isEditing}
                                                            class="mr-2 h-4 w-4"
                                                        />
                                                        <div>
                                                            <div class="font-medium">{role.name}</div>
                                                            {#if role.description}
                                                                <div class="text-sm">{role.description}</div>
                                                            {/if}
                                                        </div>
                                                    </label>
                                                {/each}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>

                            <!-- 子组织角色 -->
                            <div>
                                <h3 class="text-md font-semibold mb-4">子组织角色</h3>
                                <div class="space-y-4">
                                    {#each data.subOrganizations as subOrg}
                                        <div class="border rounded-lg p-4">
                                            <h4 class="font-medium mb-3">
                                                {subOrg.name}
                                                <span class="text-sm ml-2">
                                                    (属于 {getOrganizationName(subOrg.organizationId)})
                                                </span>
                                            </h4>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {#each data.subOrganizationRoles as role}
                                                    <label class="flex items-center p-2 border rounded hover:bg-gray-50 transition-colors duration-200 {isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}">
                                                        <input
                                                            type="radio"
                                                            name="subOrganizationRolePairs"
                                                            value="{subOrg.id}-{role.id}"
                                                            checked={selectedSubOrganizationRoles.get(subOrg.id) === role.id}
                                                            onchange={() => toggleSubOrganizationRole(subOrg.id, role.id)}
                                                            disabled={!isEditing}
                                                            class="mr-2 h-4 w-4"
                                                        />
                                                        <div>
                                                            <div class="font-medium">{role.name}</div>
                                                            {#if role.description}
                                                                <div class="text-sm">{role.description}</div>
                                                            {/if}
                                                        </div>
                                                    </label>
                                                {/each}
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>

                            <!-- 当前角色显示 -->
                            {#if !isEditing}
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <h3 class="text-md font-semibold mb-3">当前角色</h3>
                                    <div class="space-y-3">
                                        <!-- 系统角色 -->
                                        {#if currentUserSystemRoles.length > 0}
                                            <div>
                                                <span class="text-sm font-medium">系统角色：</span>
                                                <div class="flex flex-wrap gap-2 mt-1">
                                                    {#each currentUserSystemRoles as ur}
                                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {getSystemRoleName(ur.systemRoleId)}
                                                        </span>
                                                    {/each}
                                                </div>
                                            </div>
                                        {/if}

                                        <!-- 组织角色 -->
                                        {#if currentUserOrganizationRoles.length > 0}
                                            <div>
                                                <span class="text-sm font-medium">组织角色：</span>
                                                <div class="flex flex-wrap gap-2 mt-1">
                                                    {#each currentUserOrganizationRoles as ur}
                                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {getOrganizationName(ur.organizationId)} - {getOrganizationRoleName(ur.organizationRoleId)}
                                                        </span>
                                                    {/each}
                                                </div>
                                            </div>
                                        {/if}

                                        <!-- 子组织角色 -->
                                        {#if currentUserSubOrganizationRoles.length > 0}
                                            <div>
                                                <span class="text-sm font-medium">子组织角色：</span>
                                                <div class="flex flex-wrap gap-2 mt-1">
                                                    {#each currentUserSubOrganizationRoles as ur}
                                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {getSubOrganizationName(ur.subOrganizationId)} - {getSubOrganizationRoleName(ur.subOrganizationRoleId)}
                                                        </span>
                                                    {/each}
                                                </div>
                                            </div>
                                        {/if}

                                        {#if !currentUserHasAnyRoles}
                                            <p class="text-sm">该用户暂无任何角色分配</p>
                                        {/if}
                                    </div>
                                </div>
                            {/if}

                            <!-- 保存按钮 -->
                            {#if isEditing}
                                <div class="flex justify-end pt-6 border-t">
                                    <button
                                        type="submit"
                                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        保存角色分配
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </form>
                </div>
            {:else}
                <div class="rounded-lg shadow-sm border p-8">
                    <div class="text-center">
                        <div class="mx-auto h-12 w-12">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 class="mt-2 text-sm font-medium">选择用户</h3>
                        <p class="mt-1 text-sm">
                            请从左侧用户列表中选择一个用户来管理其角色分配
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

