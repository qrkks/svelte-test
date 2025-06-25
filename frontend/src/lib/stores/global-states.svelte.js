import { createPersistedState } from './persisted-simple.svelte.js';

// 全局持久化状态
export const globalCounter = createPersistedState('global-counter', 0);

export const userSettings = createPersistedState('user-settings', {
    theme: 'light',
    language: 'zh',
    notifications: true
});

export const shoppingCart = createPersistedState('shopping-cart', {
    items: [],
    total: 0
});

// 也可以创建一些辅助函数
export const cartActions = {
    addItem(item) {
        const currentCart = shoppingCart.value;
        shoppingCart.value = {
            ...currentCart,
            items: [...currentCart.items, item],
            total: currentCart.total + item.price
        };
    },
    
    clearCart() {
        shoppingCart.clear();
        shoppingCart.value = { items: [], total: 0 };
    }
}; 