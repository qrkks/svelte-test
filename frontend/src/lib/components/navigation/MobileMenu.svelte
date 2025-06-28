<script>
    import { slide } from 'svelte/transition';
    import { navbarState, navbarActions } from './navbar.svelte.js';
    import { authState } from '$lib/stores/global/auth.svelte.js';
    import { enhance } from '$app/forms';
    import NavLink from './NavLink.svelte';
    
    // 点击菜单项时关闭菜单
    function handleNavClick() {
        navbarActions.closeMobileMenu();
    }
    
    // 获取用户头像字母和颜色
    function getAvatarLetter(username) {
        return username ? username.charAt(0).toUpperCase() : '?';
    }

    function getAvatarColor(username) {
        if (!username) return 'bg-gray-500';
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
        ];
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    }
</script>

{#if navbarState.mobileMenuOpen}
    <div 
        id="mobile-menu"
        class="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        transition:slide={{ duration: 200 }}
        role="dialog"
        aria-label="移动端导航菜单"
    >
        <div class="px-4 py-4 space-y-2">
            <!-- 导航链接 -->
            <nav aria-label="移动端主要导航">
                {#each navbarState.navItems as item}
                    {#if item.children && item.children.length > 0}
                        <!-- 有子菜单的项目 -->
                        <div class="space-y-1">
                            <!-- 父级链接 -->
                            <NavLink 
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                mobile={true}
                                onclick={handleNavClick}
                            />
                            
                            <!-- 子菜单 -->
                            <div class="ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                                {#each item.children as child}
                                    <NavLink 
                                        href={child.href}
                                        label={child.label}
                                        icon={child.icon}
                                        mobile={true}
                                        onclick={handleNavClick}
                                    />
                                {/each}
                            </div>
                        </div>
                    {:else}
                        <!-- 普通菜单项 -->
                        <NavLink 
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            mobile={true}
                            onclick={handleNavClick}
                        />
                    {/if}
                {/each}
            </nav>
            
            <!-- 分割线 -->
            <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            
            <!-- 用户信息区域 -->
            {#if authState.isLoggedIn}
                <section aria-labelledby="user-info-heading">
                    <h3 id="user-info-heading" class="sr-only">用户信息</h3>
                    
                    <!-- 用户信息卡片 -->
                    <div class="flex items-center gap-3 px-3 py-2 mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="w-10 h-10 {getAvatarColor(authState.username)} rounded-full flex items-center justify-center text-white font-semibold">
                            {getAvatarLetter(authState.username)}
                        </div>
                        <div class="flex-1">
                            <div class="font-medium text-gray-900 dark:text-white">
                                {authState.username}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {authState.role}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 用户操作菜单 -->
                    <div class="space-y-1">
                        <!-- 个人资料 -->
                        <NavLink 
                            href="/profile"
                            label="个人资料"
                            icon="👤"
                            mobile={true}
                            onclick={handleNavClick}
                        />
                        
                        <!-- 账户设置 -->
                        <NavLink 
                            href="/settings/auth"
                            label="账户设置"
                            icon="⚙️"
                            mobile={true}
                            onclick={handleNavClick}
                        />
                        
                        <!-- 修改密码 -->
                        <NavLink 
                            href="/settings/auth/password"
                            label="修改密码"
                            icon="🔑"
                            mobile={true}
                            onclick={handleNavClick}
                        />
                        
                        <!-- 退出登录 -->
                        <form method="POST" action="/settings/auth?/logout" use:enhance>
                            <button 
                                type="submit"
                                class="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                onclick={handleNavClick}
                            >
                                <span aria-hidden="true">🚪</span>
                                <span>退出登录</span>
                            </button>
                        </form>
                    </div>
                </section>
            {:else}
                <!-- 登录按钮 -->
                <NavLink 
                    href="/settings/auth/login"
                    label="登录"
                    icon="🔑"
                    mobile={true}
                    onclick={handleNavClick}
                />
            {/if}
        </div>
    </div>
{/if} 