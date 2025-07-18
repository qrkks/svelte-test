import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load = async () => {
	try {
		const users = await db.select({ username: table.user.username }).from(table.user);
		console.log(users);
		return { users };
	} catch (error) {
		console.error('查询错误:', error);
		return { users: [], error: error.message };
	}
};
