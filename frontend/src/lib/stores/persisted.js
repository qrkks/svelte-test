import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// 创建持久化 store 的函数
export function createPersistedStore(key, defaultValue) {
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
    
    // 创建 writable store
    const store = writable(value);
    
    // 订阅变化并持久化（在组件中使用）
    if (browser) {
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
    
    return store;
}

// 创建持久化 store 的函数（支持自定义序列化）
export function createPersistedStoreWithOptions(key, defaultValue, options = {}) {
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
    
    // 创建 writable store
    const store = writable(value);
    
    // 订阅变化并持久化
    if (browser) {
        store.subscribe(value => {
            const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
            storageObj.setItem(key, serialize(value));
        });
    }
    
    return store;
} 