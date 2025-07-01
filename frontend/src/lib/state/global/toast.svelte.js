// Toast 状态管理
export const toastState = $state({
    items: [] // 支持多个 toast 同时显示
});

let toastId = 0;

// 显示 toast
export function showToast(message, type = 'info', duration = 3000) {
    const id = toastId++;
    
    const toast = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration,
        visible: true
    };
    
    // 添加到状态
    toastState.items.push(toast);
    
    // 自动移除
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }
    
    return id;
}

// 移除 toast
export function removeToast(id) {
    const index = toastState.items.findIndex(item => item.id === id);
    if (index > -1) {
        toastState.items.splice(index, 1);
    }
}

// 清空所有 toast
export function clearToasts() {
    toastState.items.length = 0;
}

// 便捷方法
export const toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
}; 