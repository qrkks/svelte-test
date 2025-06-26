<script>
    import { slide } from 'svelte/transition';
    import { navbarState, navbarActions } from './navbar.svelte.js';
    import { authState } from '$lib/stores/global/auth.svelte.js';
    import NavLink from './NavLink.svelte';
    
    // 点击菜单项时关闭菜单
    function handleNavClick() {
        navbarActions.closeMobileMenu();
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
                    <div class="flex items-center gap-3 px-3 py-2">
                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {authState.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="font-medium text-gray-900 dark:text-white">
                                {authState.username}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {authState.role}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 登出按钮 -->
                    <button 
                        class="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="登出账户"
                    >
                        <span aria-hidden="true">🚪</span>
                        <span>登出</span>
                    </button>
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