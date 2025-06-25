import { browser } from '$app/environment';

// 创建持久化 store 的函数
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
    
    // 创建 $state
    const state = $state(value);
    
    // 使用 $effect.root 监听变化并持久化
    $effect.root(() => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(state));
        }
    });
    
    // 添加重置方法
    const reset = () => {
        if (browser) {
            localStorage.removeItem(key);
            window.location.reload();
        }
    };
    
    return { state, reset };
}

// 创建持久化 store 的函数（支持自定义选项）
export function createPersistedStateWithOptions(key, defaultValue, options = {}) {
    const {
        storage = 'localStorage',
        serialize = JSON.stringify,
        deserialize = JSON.parse
    } = options;
    
    let value = defaultValue;
    
    // 从存储中加载初始值
    if (browser) {
        const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
        const saved = storageObj.getItem(key);
        if (saved) {
            try {
                value = deserialize(saved);
            } catch {
                value = defaultValue;
            }
        }
    }
    
    // 创建 $state
    const state = $state(value);
    
    // 使用 $effect.root 监听变化并持久化
    $effect.root(() => {
        if (browser) {
            const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
            storageObj.setItem(key, serialize(state));
        }
    });
    
    // 添加重置方法
    const reset = () => {
        if (browser) {
            const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
            storageObj.removeItem(key);
            window.location.reload();
        }
    };
    
    return { state, reset };
}

// 预定义的持久化状态 - 使用对象包装所有状态
export const user = $state({ name: '', theme: 'light' });
export const todos = $state([]);
export const settings = $state({ notifications: true, language: 'zh' });
export const sessionData = $state({ temp: 'session data' });

// 数字类型也使用对象包装
export const count = $state({ value: 0 });

// 从 localStorage 加载 count 初始值
if (browser) {
    const saved = localStorage.getItem('global-count');
    if (saved) {
        try {
            count.value = JSON.parse(saved);
        } catch {
            count.value = 0;
        }
    }
}

// 监听 count 变化并持久化
$effect.root(() => {
    if (browser) {
        localStorage.setItem('global-count', JSON.stringify(count.value));
    }
});

// 重置函数
export const resetCount = () => {
    if (browser) {
        localStorage.removeItem('global-count');
        count.value = 0;
    }
}; 