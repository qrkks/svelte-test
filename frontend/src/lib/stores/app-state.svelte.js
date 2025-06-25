import { createLocalState, createSessionState } from './persisted-correct.svelte.js';

// ========== 应用级全局状态 ==========

// 用户认证状态
export const authState = createLocalState('auth', {
    isLoggedIn: false,
    userId: null,
    username: '',
    role: 'user',
    lastLoginTime: null
});

// 应用主题和UI设置
export const uiSettings = createLocalState('ui-settings', {
    theme: 'light',
    language: 'zh',
    sidebar: {
        collapsed: false,
        width: 250
    },
    fontSize: 'medium',
    enableAnimations: true
});

// 购物车状态
export const cartState = createLocalState('shopping-cart', {
    items: [],
    total: 0,
    couponCode: '',
    shippingAddress: null
});

// 用户偏好设置
export const userPreferences = createLocalState('user-prefs', {
    notifications: {
        email: true,
        push: false,
        sms: false
    },
    privacy: {
        profileVisible: true,
        showEmail: false,
        allowAnalytics: true
    },
    defaultValues: {
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD'
    }
});

// ========== 会话级状态 ==========

// 当前会话的临时数据
export const sessionState = createSessionState('session', {
    currentPage: 'home',
    breadcrumb: [],
    unsavedChanges: false,
    lastActivity: Date.now()
});

// 表单草稿（防止用户意外关闭页面丢失数据）
export const formDrafts = createSessionState('form-drafts', {});

// ========== 业务逻辑函数 ==========

// 用户登录
export function login(username, userId, role = 'user') {
    authState.value = {
        isLoggedIn: true,
        userId,
        username,
        role,
        lastLoginTime: new Date().toISOString()
    };
    
    // 清除会话中的敏感数据
    sessionState.value.unsavedChanges = false;
}

// 用户登出
export function logout() {
    authState.value = {
        isLoggedIn: false,
        userId: null,
        username: '',
        role: 'user',
        lastLoginTime: null
    };
    
    // 清除购物车
    cartState.reset();
    
    // 保留UI设置但清除会话数据
    sessionState.reset();
    formDrafts.reset();
}

// 切换主题
export function toggleTheme() {
    const currentTheme = uiSettings.value.theme;
    uiSettings.value.theme = currentTheme === 'light' ? 'dark' : 'light';
}

// 购物车操作
export const cart = {
    // 添加商品
    addItem(product, quantity = 1) {
        const existingItem = cartState.value.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartState.value.items.push({
                ...product,
                quantity
            });
        }
        
        // 重新计算总价
        this.updateTotal();
    },
    
    // 移除商品
    removeItem(productId) {
        cartState.value.items = cartState.value.items.filter(item => item.id !== productId);
        this.updateTotal();
    },
    
    // 更新数量
    updateQuantity(productId, quantity) {
        const item = cartState.value.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.updateTotal();
            }
        }
    },
    
    // 清空购物车
    clear() {
        cartState.value.items = [];
        cartState.value.total = 0;
    },
    
    // 计算总价
    updateTotal() {
        cartState.value.total = cartState.value.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
    },
    
    // 获取商品数量
    get itemCount() {
        return cartState.value.items.reduce((sum, item) => sum + item.quantity, 0);
    }
};

// 表单草稿管理
export const drafts = {
    // 保存表单草稿
    save(formId, data) {
        formDrafts.value[formId] = {
            data,
            savedAt: new Date().toISOString()
        };
    },
    
    // 获取表单草稿
    get(formId) {
        return formDrafts.value[formId]?.data || null;
    },
    
    // 删除表单草稿
    remove(formId) {
        if (formDrafts.value[formId]) {
            delete formDrafts.value[formId];
            // 触发响应式更新
            formDrafts.value = { ...formDrafts.value };
        }
    },
    
    // 检查是否有草稿
    has(formId) {
        return formId in formDrafts.value;
    }
};

// 页面导航管理
export const navigation = {
    // 设置当前页面
    setCurrentPage(page, addToBreadcrumb = true) {
        sessionState.value.currentPage = page;
        
        if (addToBreadcrumb) {
            this.addToBreadcrumb(page);
        }
    },
    
    // 添加到面包屑
    addToBreadcrumb(page) {
        const breadcrumb = sessionState.value.breadcrumb;
        const lastItem = breadcrumb[breadcrumb.length - 1];
        
        // 避免重复添加相同页面
        if (lastItem !== page) {
            breadcrumb.push(page);
            
            // 限制面包屑长度
            if (breadcrumb.length > 5) {
                breadcrumb.shift();
            }
        }
    },
    
    // 清除面包屑
    clearBreadcrumb() {
        sessionState.value.breadcrumb = [];
    }
};

// ========== 计算属性（getter函数）==========

// 检查用户是否是管理员
export function isAdmin() {
    return authState.value.role === 'admin';
}

// 获取格式化的最后登录时间
export function getLastLoginFormatted() {
    const lastLogin = authState.value.lastLoginTime;
    if (!lastLogin) return '从未登录';
    
    return new Date(lastLogin).toLocaleString('zh-CN');
}

// 获取购物车摘要
export function getCartSummary() {
    const { items, total } = cartState.value;
    return {
        itemCount: cart.itemCount,
        total: total.toFixed(2),
        isEmpty: items.length === 0
    };
}

// ========== 初始化和清理 ==========

// 应用启动时的初始化
export function initializeApp() {
    // 更新最后活动时间
    sessionState.value.lastActivity = Date.now();
    
    // 检查认证状态是否过期（比如7天）
    const lastLogin = authState.value.lastLoginTime;
    if (lastLogin) {
        const daysSinceLogin = (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLogin > 7) {
            logout();
        }
    }
}

// 重置所有状态（用于测试或重新开始）
export function resetAllAppState() {
    authState.reset();
    uiSettings.reset();
    cartState.reset();
    userPreferences.reset();
    sessionState.reset();
    formDrafts.reset();
} 