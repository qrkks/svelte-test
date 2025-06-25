import { browser } from '$app/environment';

// 创建持久化状态的简单版本
export function createPersistedState(key, defaultValue) {
    let value = defaultValue;
    
    // 从 localStorage 加载初始值
    if (browser) {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                value = JSON.parse(saved);
            } catch {
                value = defaultValue;
            }
        }
    }
    
    // 统一包装成对象
    const state = $state({ value });
    
    // 创建保存函数
    const save = () => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(state.value));
        }
    };
    
    // 重置函数
    const reset = () => {
        if (browser) {
            localStorage.removeItem(key);
        }
        state.value = defaultValue;
    };
    
    return { 
        get value() { return state.value; },
        set value(newValue) { 
            state.value = newValue; 
            save();
        },
        save, 
        reset,
        // 直接暴露state以确保响应性
        state
    };
} 