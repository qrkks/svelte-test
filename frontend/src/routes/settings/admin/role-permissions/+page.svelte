<script>
    export let data;

    let selectedRole = null;
    let selectedRoleType = null; // 'system' | 'organization' | 'subOrganization'
    let rolePermissions = [];

    // 选择角色时，加载其权限
    function selectRole(role, type) {
        selectedRole = role;
        selectedRoleType = type;
        if (type === 'system') {
            rolePermissions = data.systemRolePermissions
                .filter(rp => rp.systemRoleId === role.id)
                .map(rp => rp.permission);
        } else if (type === 'organization') {
            rolePermissions = data.organizationRolePermissions
                .filter(rp => rp.organizationRoleId === role.id)
                .map(rp => rp.permission);
        } else if (type === 'subOrganization') {
            rolePermissions = data.subOrganizationRolePermissions
                .filter(rp => rp.subOrganizationRoleId === role.id)
                .map(rp => rp.permission);
        }
    }

    // 勾选/取消权限（这里只做前端演示，实际保存需补充API）
    function togglePermission(permission) {
        if (rolePermissions.includes(permission)) {
            rolePermissions = rolePermissions.filter(p => p !== permission);
        } else {
            rolePermissions = [...rolePermissions, permission];
        }
    }
</script>

<h2>角色-权限分配</h2>
<div style="display: flex; gap: 2rem;">
    <!-- 角色列表 -->
    <div style="min-width: 200px;">
        <h3>系统角色</h3>
        {#each data.systemRoles as role}
            <button type="button"
                onclick={() => selectRole(role, 'system')}
                class:selected={selectedRole && selectedRole.id === role.id && selectedRoleType === 'system'}
                style="display:block; width:100%; text-align:left; padding:4px; background:{selectedRole && selectedRole.id === role.id && selectedRoleType === 'system' ? '#eef' : 'transparent'}">
                {role.name}
            </button>
        {/each}
        <h3>主组织角色</h3>
        {#each data.organizationRoles as role}
            <button type="button"
                onclick={() => selectRole(role, 'organization')}
                class:selected={selectedRole && selectedRole.id === role.id && selectedRoleType === 'organization'}
                style="display:block; width:100%; text-align:left; padding:4px; background:{selectedRole && selectedRole.id === role.id && selectedRoleType === 'organization' ? '#eef' : 'transparent'}">
                {role.name}
            </button>
        {/each}
        <h3>子组织角色</h3>
        {#each data.subOrganizationRoles as role}
            <button type="button"
                onclick={() => selectRole(role, 'subOrganization')}
                class:selected={selectedRole && selectedRole.id === role.id && selectedRoleType === 'subOrganization'}
                style="display:block; width:100%; text-align:left; padding:4px; background:{selectedRole && selectedRole.id === role.id && selectedRoleType === 'subOrganization' ? '#eef' : 'transparent'}">
                {role.name}
            </button>
        {/each}
    </div>

    <!-- 权限分配 -->
    <div style="flex:1;">
        {#if selectedRole}
            <h3>为【{selectedRole.name}】分配权限</h3>
            <form method="post" action="?/save" use:enhance>
                <input type="hidden" name="roleType" value={selectedRoleType} />
                <input type="hidden" name="roleId" value={selectedRole.id} />
                <ul>
                    {#each data.permissions as permission}
                        <li>
                            <label>
                                <input type="checkbox"
                                       name="permissions"
                                       value={permission}
                                       checked={rolePermissions.includes(permission)}
                                       on:change={() => togglePermission(permission)} />
                                {permission}
                            </label>
                        </li>
                    {/each}
                </ul>
                <button type="submit">保存</button>
            </form>
        {:else}
            <p>请选择左侧的角色</p>
        {/if}
    </div>
</div>