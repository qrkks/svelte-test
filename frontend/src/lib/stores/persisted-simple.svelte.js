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
    
    // 创建响应式状态对象
    const stateObj = $state({ current: value });
    
    // 创建保存函数
    const save = () => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(stateObj.current));
        }
    };
    
    return {
        get value() { 
            return stateObj.current; 
        },
        set value(newValue) { 
            stateObj.current = newValue; 
            save();
        },
        save,
        clear() {
            if (browser) {
                localStorage.removeItem(key);
            }
        }
    };
} 