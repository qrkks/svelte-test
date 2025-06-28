// 用户认证状态
export const authState = $state({
	id: null,
	username: '',
	role: 'user',
	lastLoginTime: null,
	get isLoggedIn() {
		return this.id !== null;
	}
});
