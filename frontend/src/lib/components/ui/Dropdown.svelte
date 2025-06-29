<script module>
    // 全局下拉菜单状态管理
    let activeDropdownId = $state(null);
    let dropdownInstances = $state(new Map());
    
    // 全局下拉菜单管理器
    export const dropdownManager = {
        // 注册下拉菜单实例
        register(id, instance) {
            dropdownInstances.set(id, instance);
        },
        
        // 注销下拉菜单实例
        unregister(id) {
            dropdownInstances.delete(id);
            if (activeDropdownId === id) {
                activeDropdownId = null;
            }
        },
        
        // 打开指定下拉菜单（关闭其他所有）
        open(id) {
            // 关闭其他所有下拉菜单
            dropdownInstances.forEach((instance, currentId) => {
                if (currentId !== id) {
                    instance.setOpen(false);
                }
            });
            
            // 打开指定的下拉菜单
            const targetInstance = dropdownInstances.get(id);
            if (targetInstance) {
                targetInstance.setOpen(true);
            }
            
            activeDropdownId = id;
        },
        
        // 关闭指定下拉菜单
        close(id) {
            const instance = dropdownInstances.get(id);
            if (instance) {
                instance.setOpen(false);
            }
            if (activeDropdownId === id) {
                activeDropdownId = null;
            }
        },
        
        // 关闭所有下拉菜单
        closeAll() {
            dropdownInstances.forEach((instance) => {
                instance.setOpen(false);
            });
            activeDropdownId = null;
        },
        
        // 检查是否为当前活跃的下拉菜单
        isActive(id) {
            return activeDropdownId === id;
        }
    };
</script>

<script>
    import { onMount } from 'svelte';
    
    let { 
        open = false,
        disabled = false,
        placement = 'bottom-start', // bottom-start, bottom-end, top-start, top-end
        offset = 4,
        closeOnClickOutside = true,
        closeOnEscape = true,
        trigger,
        content,
        // Callback props
        onToggle
    } = $props();
    
    // 生成唯一ID
    const dropdownId = crypto.randomUUID();
    
    let triggerElement;
    let dropdownElement = $state(null);
    let closeTimeout = $state(null);
    
    // 使用本地状态，不依赖全局状态的 $derived
    let isOpen = $state(open);
    
    // 提供给全局管理器的接口
    const instanceInterface = {
        setOpen: (value) => {
            isOpen = value;
        }
    };
    
    // 响应外部 open 状态变化
    $effect(() => {
        isOpen = open;
    });
    
    // 通知外部状态变化
    $effect(() => {
        onToggle?.(isOpen);
    });
    
    // 切换下拉菜单
    function toggle() {
        if (disabled) return;
        
        if (isOpen) {
            dropdownManager.close(dropdownId);
        } else {
            dropdownManager.open(dropdownId);
        }
        clearCloseTimeout();
    }
    
    // 关闭下拉菜单
    function close() {
        dropdownManager.close(dropdownId);
        clearCloseTimeout();
    }
    
    // 打开下拉菜单
    function openDropdown() {
        if (disabled) return;
        dropdownManager.open(dropdownId);
        clearCloseTimeout();
    }
    
    // 延迟关闭（给用户时间移动到下拉内容）
    function delayedClose() {
        clearCloseTimeout();
        closeTimeout = setTimeout(() => {
            dropdownManager.close(dropdownId);
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
        // 注册到全局管理器
        dropdownManager.register(dropdownId, instanceInterface);
        
        if (closeOnClickOutside) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            // 注销并清理
            dropdownManager.unregister(dropdownId);
            if (closeOnClickOutside) {
                document.removeEventListener('click', handleClickOutside);
            }
            clearCloseTimeout();
        };
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
            class="absolute {positionClasses} z-50 min-w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible {placement === 'bottom-end' ? '-translate-x-8' : ''}"
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