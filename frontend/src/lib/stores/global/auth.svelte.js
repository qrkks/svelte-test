// 用户认证状态
export const authState = $state({
	userId: null,
	username: '',
	role: 'user',
	lastLoginTime: null,
    get isLoggedIn() {
        return this.userId !== null;
    }
});

// export const isLoggedIn = $derived(authState.userId !== null);
