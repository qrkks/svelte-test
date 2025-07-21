import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
	const testList = await db.select().from(table.test).orderBy(desc(table.test.id));
	return {
		testList: testList
	};
};

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
		const id = Number(formData.get('id'));
		await db.delete(table.test).where(eq(table.test.id, id));
		return {
			success: true
		};
	}
};
