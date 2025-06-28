import { createLocalState } from '$lib/stores/persisted.svelte.js';

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
