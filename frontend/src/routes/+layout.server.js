/**
 * SvelteKit 服务器端加载函数，用于获取用户信息
 * @param {Object} event - 服务器端加载事件对象
 * @param {Object} event.locals - 请求本地上下文对象，包含用户信息
 * @param {Object} [event.locals.user] - 当前登录用户信息
 * @returns {Promise<{user: Object|null}>} 返回包含用户信息的对象
 */
export async function load({ locals }) {
	return {
		user: locals.user,
	};
}