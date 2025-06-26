<script>
    import { createEventDispatcher, onMount } from 'svelte';
    
    let { 
        open = false,
        disabled = false,
        placement = 'bottom-start', // bottom-start, bottom-end, top-start, top-end
        offset = 4,
        closeOnClickOutside = true,
        closeOnEscape = true,
        trigger,
        content
    } = $props();
    
    const dispatch = createEventDispatcher();
    
    let triggerElement;
    let dropdownElement = $state(null);
    let isOpen = $state(open);
    let closeTimeout = $state(null);
    
    // 响应外部 open 状态变化
    $effect(() => {
        isOpen = open;
    });
    
    // 通知外部状态变化
    $effect(() => {
        dispatch('toggle', isOpen);
    });
    
    // 切换下拉菜单
    function toggle() {
        if (disabled) return;
        isOpen = !isOpen;
        clearCloseTimeout();
    }
    
    // 关闭下拉菜单
    function close() {
        isOpen = false;
        clearCloseTimeout();
    }
    
    // 打开下拉菜单
    function openDropdown() {
        if (disabled) return;
        isOpen = true;
        clearCloseTimeout();
    }
    
    // 延迟关闭（给用户时间移动到下拉内容）
    function delayedClose() {
        clearCloseTimeout();
        closeTimeout = setTimeout(() => {
            isOpen = false;
        }, 300); // 300ms 延迟
    }
    
    // 清除关闭定时器
    function clearCloseTimeout() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    }
    
    // 处理键盘事件
    function handleKeydown(event) {
        if (event.key === 'Escape' && closeOnEscape) {
            close();
            triggerElement?.focus();
        }
        
        if (event.key === 'ArrowDown' && !isOpen) {
            openDropdown();
            event.preventDefault();
        }
    }
    
    // 处理点击外部
    function handleClickOutside(event) {
        if (!closeOnClickOutside || !isOpen) return;
        
        if (
            !triggerElement?.contains(event.target) &&
            !dropdownElement?.contains(event.target)
        ) {
            close();
        }
    }
    
    // 计算下拉菜单位置的 CSS 类
    let positionClasses = $derived(() => {
        switch (placement) {
            case 'bottom-start':
                return 'top-full left-0';
            case 'bottom-end':
                return 'top-full right-0';
            case 'top-start':
                return 'bottom-full left-0 mb-1';
            case 'top-end':
                return 'bottom-full right-0 mb-1';
            default:
                return 'top-full left-0';
        }
    });
    
    onMount(() => {
        if (closeOnClickOutside) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
                clearCloseTimeout();
            };
        }
    });
</script>

<div class="relative inline-block">
    <!-- 触发器 -->
    <div 
        bind:this={triggerElement}
        role="button"
        tabindex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-disabled={disabled}
        onkeydown={handleKeydown}
        onclick={toggle}
        onmouseenter={openDropdown}
        onmouseleave={delayedClose}
        class="cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    >
        {@render trigger()}
    </div>
    
    <!-- 下拉内容 -->
    {#if isOpen}
        <div 
            bind:this={dropdownElement}
            class="absolute {positionClasses} z-50 min-w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible"
            class:opacity-100={isOpen}
            class:visible={isOpen}
            style="transition: opacity 200ms, visibility 200ms, transform 200ms; transform: scale({isOpen ? '1' : '0.95'}); margin-top: 2px;"
            role="menu"
            tabindex="-1"
            aria-labelledby="dropdown-trigger"
            onmouseenter={clearCloseTimeout}
            onmouseleave={delayedClose}
        >
            {@render content({ close })}
        </div>
    {/if}
</div>

<style>
    .animate-in {
        animation-duration: 200ms;
        animation-fill-mode: both;
    }
    
    .fade-in-0 {
        animation-name: fadeIn;
    }
    
    .zoom-in-95 {
        animation-name: zoomIn;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.95); }
        to { transform: scale(1); }
    }
</style> 