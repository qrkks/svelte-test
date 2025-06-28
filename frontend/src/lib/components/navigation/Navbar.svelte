<script>
    import { navbarState, navbarActions } from './navbar.svelte.js';
    import NavLink from './NavLink.svelte';
    import MobileMenu from './MobileMenu.svelte';
    import UserMenu from './UserMenu.svelte';
    import Dropdown from '$lib/components/ui/Dropdown.svelte';
    
    // 汉堡菜单切换
    function toggleMobileMenu() {
        navbarActions.toggleMobileMenu();
    }
</script>

<nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" aria-label="主导航">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- 左侧：Logo 和 桌面端导航 -->
            <div class="flex items-center gap-8">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-2" aria-label="Svelte App 首页">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm" aria-hidden="true">SV</span>
                    </div>
                    <span class="text-xl font-bold text-gray-900 dark:text-white">Svelte App</span>
                </a>
                
                <!-- 桌面端导航链接 -->
                <nav class="hidden lg:flex items-center gap-1" aria-label="主要导航">
                    {#each navbarState.navItems as item}
                        {#if item.children && item.children.length > 0}
                            <!-- 下拉菜单项 -->
                            <Dropdown placement="bottom-start">
                                {#snippet trigger()}
                                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        <span class="text-lg" aria-hidden="true">{item.icon}</span>
                                        <span>{item.label}</span>
                                        <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                {/snippet}
                                
                                {#snippet content({ close })}
                                    <div class="py-2">
                                        <!-- 父级页面链接 -->
                                        <a 
                                            href={item.href} 
                                            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onclick={close}
                                        >
                                            <span class="text-base" aria-hidden="true">{item.icon}</span>
                                            <span>{item.label}首页</span>
                                        </a>
                                        
                                        <!-- 分割线 -->
                                        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                        
                                        <!-- 子页面链接 -->
                                        {#each item.children as child}
                                            <a 
                                                href={child.href} 
                                                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                onclick={close}
                                            >
                                                <span class="text-base" aria-hidden="true">{child.icon}</span>
                                                <span>{child.label}</span>
                                            </a>
                                        {/each}
                                    </div>
                                {/snippet}
                            </Dropdown>
                        {:else}
                            <!-- 普通菜单项 -->
                            <NavLink 
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                            />
                        {/if}
                    {/each}
                </nav>
            </div>
            
            <!-- 右侧：用户菜单 和 汉堡菜单 -->
            <div class="flex items-center gap-4">
                <!-- 🎯 使用新的用户组件 -->
                <UserMenu />
                
                <!-- 汉堡菜单按钮 -->
                <button 
                    onclick={toggleMobileMenu}
                    class="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:focus"
                    aria-label={navbarState.mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
                    aria-expanded={navbarState.mobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    {#if navbarState.mobileMenuOpen}
                        <!-- 关闭图标 -->
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    {:else}
                        <!-- 汉堡图标 -->
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
    </div>
    
    <!-- 移动端菜单 -->
    <MobileMenu />
</nav> 