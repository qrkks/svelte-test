import { createLocalState } from '../../persisted.svelte.js';

// 用户认证状态
export const authState = createLocalState('auth', {
    isLoggedIn: false,
    userId: null,
    username: '',
    role: 'user',
    lastLoginTime: null
}); 