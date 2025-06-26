<script>
    import { page } from '$app/stores';
    
    let { 
        href = '/',
        label = '',
        icon = '',
        mobile = false,
        onclick = () => {}
    } = $props();
    
    // 检查是否是当前页面
    let isActive = $derived($page.url.pathname === href);
    
    // 样式类
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium";
    const desktopClasses = "text-sm hover:bg-gray-100 dark:hover:bg-gray-700";
    const mobileClasses = "text-base hover:bg-gray-50 dark:hover:bg-gray-800";
    const activeClasses = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
    const inactiveClasses = "text-gray-700 dark:text-gray-300";
    
    let classes = $derived(() => {
        let result = baseClasses;
        result += mobile ? ` ${mobileClasses}` : ` ${desktopClasses}`;
        result += isActive ? ` ${activeClasses}` : ` ${inactiveClasses}`;
        return result;
    });
</script>

<a 
    {href} 
    class={classes}
    {onclick}
    data-sveltekit-preload-data="hover"
    aria-current={isActive ? 'page' : undefined}
>
    {#if icon}
        <span class="text-lg" aria-hidden="true">{icon}</span>
    {/if}
    <span>{label}</span>
</a> 