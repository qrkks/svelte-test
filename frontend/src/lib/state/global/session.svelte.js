import { createSessionState } from '$lib/state/persisted.svelte.js';

// 当前会话的临时数据
export const sessionState = createSessionState('session', {
    currentPage: 'home',
    breadcrumb: [],
    unsavedChanges: false,
    lastActivity: Date.now()
});

// 表单草稿（防止用户意外关闭页面丢失数据）
export const formDrafts = createSessionState('form-drafts', {}); 