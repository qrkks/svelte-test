import { browser } from '$app/environment';

/**
 * 安全的localStorage封装
 * 自动处理SSR环境，避免服务端错误
 */
export const storage = {
    /**
     * 设置存储项
     * @param {string} key 存储键
     * @param {any} value 存储值（会自动JSON序列化）
     */
    set(key, value) {
        if (browser) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('存储失败:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * 获取存储项
     * @param {string} key 存储键
     * @param {any} defaultValue 默认值
     * @returns {any} 解析后的值或默认值
     */
    get(key, defaultValue = null) {
        if (browser) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('读取失败:', error);
                return defaultValue;
            }
        }
        return defaultValue;
    },

    /**
     * 删除存储项
     * @param {string} key 存储键
     */
    remove(key) {
        if (browser) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('删除失败:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * 清空所有存储
     */
    clear() {
        if (browser) {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('清空失败:', error);
                return false;
            }
        }
        return false;
    },

    /**
     * 检查是否存在某个键
     * @param {string} key 存储键
     * @returns {boolean}
     */
    has(key) {
        if (browser) {
            return localStorage.getItem(key) !== null;
        }
        return false;
    },

    /**
     * 获取所有存储的键
     * @returns {string[]}
     */
    keys() {
        if (browser) {
            return Object.keys(localStorage);
        }
        return [];
    }
};

/**
 * sessionStorage的安全封装
 */
export const sessionStorage = {
    set(key, value) {
        if (browser) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('会话存储失败:', error);
                return false;
            }
        }
        return false;
    },

    get(key, defaultValue = null) {
        if (browser) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('会话读取失败:', error);
                return defaultValue;
            }
        }
        return defaultValue;
    },

    remove(key) {
        if (browser) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('会话删除失败:', error);
                return false;
            }
        }
        return false;
    },

    clear() {
        if (browser) {
            try {
                sessionStorage.clear();
                return true;
            } catch (error) {
                console.warn('会话清空失败:', error);
                return false;
            }
        }
        return false;
    }
}; 