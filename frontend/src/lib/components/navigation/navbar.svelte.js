// 自动扫描页面文件并构建层级结构
function scanPages() {
    // 使用 Vite 的 import.meta.glob 扫描所有 +page.svelte 文件
    const pages = import.meta.glob('/src/routes/**/+page.svelte');
    
    // 排除的路径（不显示在导航中）
    const excludePaths = [
        // '/src/routes/settings/auth/+page.svelte',
        // '/src/routes/settings/auth/login/+page.svelte'
    ];
    
    // 页面图标映射
    const iconMap = {
        '/': '🏠',
        '/about': '📋', 
        '/settings': '⚙️',
        '/test': '🧪',
        '/test-toast': '🍞',
        '/settings/paraglide': '🌐'
    };
    
    // 页面标题映射
    const titleMap = {
        '/': '首页',
        '/about': '关于',
        '/settings': '设置', 
        '/test': '测试',
        '/test-toast': 'Toast测试',
        '/settings/paraglide': '多语言'
    };
    
    const allPages = [];
    const navItems = [];
    
    // 首先收集所有页面
    for (const path in pages) {
        // 跳过排除的页面
        if (excludePaths.includes(path)) continue;
        
        // 将文件路径转换为路由路径
        let route = path
            .replace('/src/routes', '')
            .replace('/+page.svelte', '')
            .replace(/\/\([^)]+\)/g, '') // 移除路由组
            || '/';
            
        // 生成标题（从路径或映射）
        const title = titleMap[route] || 
                     route.split('/').pop()?.replace(/-/g, ' ') || 
                     '页面';
                     
        // 生成图标
        const icon = iconMap[route] || '📄';
        
        // 计算路径层级
        const segments = route === '/' ? [] : route.split('/').filter(Boolean);
        const level = segments.length;
        
        allPages.push({
            label: title.charAt(0).toUpperCase() + title.slice(1),
            href: route,
            icon: icon,
            level: level,
            segments: segments
        });
    }
    
    // 按路径排序
    allPages.sort((a, b) => {
        if (a.href === '/') return -1;
        if (b.href === '/') return 1;
        return a.href.localeCompare(b.href);
    });
    
    // 构建层级结构
    const pageMap = new Map();
    
    // 先添加所有一级页面
    for (const page of allPages) {
        if (page.level <= 1) {
            const navItem = {
                ...page,
                children: []
            };
            navItems.push(navItem);
            pageMap.set(page.href, navItem);
        }
    }
    
    // 然后添加二级页面到对应的父级下
    for (const page of allPages) {
        if (page.level === 2) {
            const parentPath = '/' + page.segments[0];
            const parent = pageMap.get(parentPath);
            
            if (parent) {
                parent.children.push({
                    label: page.label,
                    href: page.href,
                    icon: page.icon
                });
            } else {
                // 如果没有父级页面，作为顶级菜单
                navItems.push({
                    ...page,
                    children: []
                });
            }
        }
    }
    
    return navItems;
}

// 导航栏状态管理
export const navbarState = $state({
    // 移动端菜单开关状态
    mobileMenuOpen: false,
    
    // 当前活跃的导航项
    activeRoute: '',
    
    // 自动生成的导航项
    navItems: scanPages()
});

// 导航栏操作方法
export const navbarActions = {
    // 切换移动端菜单
    toggleMobileMenu() {
        navbarState.mobileMenuOpen = !navbarState.mobileMenuOpen;
    },
    
    // 关闭移动端菜单
    closeMobileMenu() {
        navbarState.mobileMenuOpen = false;
    },
    
    // 设置当前活跃路由
    setActiveRoute(route) {
        navbarState.activeRoute = route;
    },
    
    // 重新扫描页面（开发时使用）
    refreshNavItems() {
        navbarState.navItems = scanPages();
    }
}; 