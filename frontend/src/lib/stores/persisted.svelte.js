import { browser } from '$app/environment';

/**
 * 创建持久化状态（推荐方式）
 * 返回一个带有 .value 属性的响应式对象
 */
export function createPersistedState(key, defaultValue, options = {}) {
	const {
		storage = 'localStorage',
		serialize = JSON.stringify,
		deserialize = JSON.parse
	} = options;

	// 从存储中读取初始值
	let initialValue = defaultValue;
	if (browser) {
		try {
			const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
			const saved = storageObj.getItem(key);
			if (saved !== null) {
				initialValue = deserialize(saved);
			}
		} catch (error) {
			console.warn(`读取存储失败 ${key}:`, error);
		}
	}

	// 创建响应式状态
	const state = $state({ value: initialValue });

	// 监听变化并自动保存 - 使用 $effect.root
	if (browser) {
		$effect.root(() => {
			$effect(() => {
				try {
					const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
					storageObj.setItem(key, serialize(state.value));
				} catch (error) {
					console.warn(`保存存储失败 ${key}:`, error);
				}
			});
		});
	}

	// 返回带有辅助方法的对象
	return {
		get value() {
			return state.value;
		},
		set value(newValue) {
			state.value = newValue;
		},
		reset() {
			if (browser) {
				try {
					const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
					storageObj.removeItem(key);
					state.value = defaultValue;
				} catch (error) {
					console.warn(`重置存储失败 ${key}:`, error);
				}
			}
		},
		// 用于调试
		get key() {
			return key;
		}
	};
}

/**
 * 创建 localStorage 持久化状态的快捷方式
 */
export function createLocalState(key, defaultValue) {
	return createPersistedState(key, defaultValue, { storage: 'localStorage' });
}

/**
 * 创建 sessionStorage 持久化状态的快捷方式
 */
export function createSessionState(key, defaultValue) {
	return createPersistedState(key, defaultValue, { storage: 'sessionStorage' });
}

// ========== 辅助函数 ==========

/**
 * 批量重置多个状态
 */
export function resetAll(...states) {
	states.forEach((state) => {
		if (state && typeof state.reset === 'function') {
			state.reset();
		}
	});
}

/**
 * 导出所有状态的当前值（用于调试）
 */
export function exportStates(...states) {
	const result = {};
	states.forEach((state) => {
		if (state && state.key) {
			result[state.key] = state.value;
		}
	});
	return result;
}
